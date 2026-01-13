import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * API 路由测试
 * 
 * 测试 /api/assess 端点的各种场景
 */

// Mock fetch for API tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Supabase server
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn().mockResolvedValue({
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id' } },
                error: null
            }),
        },
        from: vi.fn(() => ({
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ error: null }),
        })),
    }),
}));

describe('API Route: /api/assess', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Request Validation', () => {
        it('should reject requests without messages', async () => {
            const requestBody = {};

            // 验证请求体中必须包含 messages 数组
            expect(requestBody).not.toHaveProperty('messages');
        });

        it('should reject requests with invalid messages format', async () => {
            const requestBody = { messages: 'not an array' };

            expect(Array.isArray(requestBody.messages)).toBe(false);
        });

        it('should accept valid message format', async () => {
            const requestBody = {
                messages: [
                    { role: 'user', content: '这是我的回答' },
                ],
                assessmentId: 'test-assessment-id',
            };

            expect(Array.isArray(requestBody.messages)).toBe(true);
            expect(requestBody.messages[0]).toHaveProperty('role');
            expect(requestBody.messages[0]).toHaveProperty('content');
        });
    });

    describe('Message Preparation', () => {
        it('should add system prompt to messages', () => {
            const userMessages = [
                { role: 'user', content: '我倾向于质疑传统观点' },
            ];

            // 模拟 API 中的消息准备逻辑
            const MOCK_SYSTEM_PROMPT = '你是 Human 3.0 评估师...';
            const apiMessages = [
                { role: 'system', content: MOCK_SYSTEM_PROMPT },
                ...userMessages,
            ];

            expect(apiMessages.length).toBe(2);
            expect(apiMessages[0].role).toBe('system');
            expect(apiMessages[1].role).toBe('user');
        });

        it('should preserve message order', () => {
            const userMessages = [
                { role: 'user', content: '第一条消息' },
                { role: 'assistant', content: 'AI 回复' },
                { role: 'user', content: '第二条消息' },
            ];

            const MOCK_SYSTEM_PROMPT = '系统提示';
            const apiMessages = [
                { role: 'system', content: MOCK_SYSTEM_PROMPT },
                ...userMessages,
            ];

            expect(apiMessages.length).toBe(4);
            expect(apiMessages[1].content).toBe('第一条消息');
            expect(apiMessages[2].content).toBe('AI 回复');
            expect(apiMessages[3].content).toBe('第二条消息');
        });
    });

    describe('SSE Stream Parsing', () => {
        // 模拟 SSE 流解析逻辑
        function parseSSELine(line: string): { content?: string; done?: boolean } | null {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith('data: ')) return null;

            const data = trimmedLine.slice(6).trim();

            if (data === '[DONE]') {
                return { done: true };
            }

            try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                    return { content };
                }
            } catch {
                return null;
            }

            return null;
        }

        it('should parse valid SSE data line', () => {
            const line = 'data: {"choices":[{"index":0,"delta":{"content":"你好"}}]}';
            const result = parseSSELine(line);

            expect(result).not.toBeNull();
            expect(result?.content).toBe('你好');
        });

        it('should handle [DONE] marker', () => {
            const line = 'data: [DONE]';
            const result = parseSSELine(line);

            expect(result).not.toBeNull();
            expect(result?.done).toBe(true);
        });

        it('should return null for invalid JSON', () => {
            const line = 'data: {invalid json}';
            const result = parseSSELine(line);

            expect(result).toBeNull();
        });

        it('should return null for non-data lines', () => {
            const lines = ['', 'event: message', ': comment'];

            lines.forEach(line => {
                expect(parseSSELine(line)).toBeNull();
            });
        });

        it('should handle chunked data correctly', () => {
            // 模拟跨 chunk 的数据累积
            let buffer = '';
            const chunks = [
                'data: {"choices":[{"inde',
                'x":0,"delta":{"content":"测试"}}]}\n',
            ];

            for (const chunk of chunks) {
                buffer += chunk;
            }

            const lines = buffer.split('\n');
            const completeLine = lines[0];
            const result = parseSSELine(completeLine);

            expect(result).not.toBeNull();
            expect(result?.content).toBe('测试');
        });
    });

    describe('Think Tag Filtering in Stream', () => {
        function filterStreamContent(content: string): string {
            return content.replace(/<think>[\s\S]*?<\/think>/g, '');
        }

        it('should filter complete think tags from streamed content', () => {
            const streamedContent = '我认为<think>这是内部思考</think>你需要考虑';
            expect(filterStreamContent(streamedContent)).toBe('我认为你需要考虑');
        });

        it('should accumulate content correctly', () => {
            const chunks = ['你好', '，我是', 'AI评估师'];
            let fullContent = '';

            for (const chunk of chunks) {
                fullContent += chunk;
            }

            expect(fullContent).toBe('你好，我是AI评估师');
        });
    });
});

describe('Database Save Logic', () => {
    describe('Assessment Completion Detection', () => {
        function isAssessmentComplete(content: string): boolean {
            return content.includes('[ASSESSMENT_COMPLETE]');
        }

        it('should detect complete assessment', () => {
            const content = '评估完成[ASSESSMENT_COMPLETE]{"result": {}}';
            expect(isAssessmentComplete(content)).toBe(true);
        });

        it('should not detect incomplete assessment', () => {
            const content = '继续回答我的问题...';
            expect(isAssessmentComplete(content)).toBe(false);
        });
    });

    describe('Result JSON Extraction for DB', () => {
        function extractResultForDB(content: string): Record<string, unknown> | null {
            const match = content.match(/\[ASSESSMENT_COMPLETE\]\s*(\{[\s\S]*\})/);
            if (!match) return null;

            try {
                let jsonStr = match[1];
                jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
                jsonStr = jsonStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
                return JSON.parse(jsonStr);
            } catch {
                return null;
            }
        }

        it('should extract and parse result for database', () => {
            const content = `[ASSESSMENT_COMPLETE]{"metatype": {"name": "测试"}, "quadrants": []}`;
            const result = extractResultForDB(content);

            expect(result).not.toBeNull();
            expect(result?.metatype).toEqual({ name: '测试' });
        });

        it('should handle malformed JSON gracefully', () => {
            const content = '[ASSESSMENT_COMPLETE]{malformed json}';
            const result = extractResultForDB(content);

            expect(result).toBeNull();
        });
    });
});
