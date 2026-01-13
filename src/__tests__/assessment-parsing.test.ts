import { describe, it, expect } from 'vitest';

/**
 * JSON 解析工具函数测试
 * 
 * 测试从 AI 响应中提取和解析 [ASSESSMENT_COMPLETE] JSON 的各种场景
 */

// 模拟 ChatInterface 中的 JSON 提取和解析逻辑
function extractAndParseAssessmentJson(content: string): Record<string, unknown> | null {
    if (!content.includes('[ASSESSMENT_COMPLETE]')) {
        return null;
    }

    let jsonStr: string | null = null;

    // Pattern 1: Single line JSON after marker
    const singleLineMatch = content.match(/\[ASSESSMENT_COMPLETE\]\s*(\{[^\n]*\})/);
    if (singleLineMatch) {
        jsonStr = singleLineMatch[1];
    }

    // Pattern 2: JSON in code block
    if (!jsonStr) {
        const codeBlockMatch = content.match(/\[ASSESSMENT_COMPLETE\][\s\S]*?```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
            jsonStr = codeBlockMatch[1];
        }
    }

    // Pattern 3: Multiline JSON after marker
    if (!jsonStr) {
        const multilineMatch = content.match(/\[ASSESSMENT_COMPLETE\]\s*(\{[\s\S]*\})/);
        if (multilineMatch) {
            jsonStr = multilineMatch[1];
        }
    }

    if (!jsonStr) {
        return null;
    }

    try {
        // 清理 JSON 字符串
        let cleanJson = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        cleanJson = cleanJson.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        try {
            return JSON.parse(cleanJson);
        } catch {
            // 如果直接解析失败，尝试转义换行符后解析
            cleanJson = cleanJson.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
            return JSON.parse(cleanJson);
        }
    } catch {
        return null;
    }
}

describe('Assessment JSON Parsing', () => {
    describe('extractAndParseAssessmentJson', () => {
        it('should return null when no ASSESSMENT_COMPLETE marker exists', () => {
            const content = '这是一段普通的文本，没有评估完成标记。';
            expect(extractAndParseAssessmentJson(content)).toBeNull();
        });

        it('should parse single-line JSON after marker', () => {
            const content = `这是评估总结。
[ASSESSMENT_COMPLETE]
{"metatype": {"name": "探索者", "description": "测试描述"}, "quadrants": []}`;

            const result = extractAndParseAssessmentJson(content);
            expect(result).not.toBeNull();
            expect(result?.metatype).toEqual({ name: '探索者', description: '测试描述' });
        });

        it('should parse JSON in code block', () => {
            const content = `这是评估总结。

[ASSESSMENT_COMPLETE]
\`\`\`json
{
  "metatype": {
    "name": "工作狂",
    "description": "过度专注于使命象限"
  },
  "quadrants": []
}
\`\`\``;

            const result = extractAndParseAssessmentJson(content);
            expect(result).not.toBeNull();
            expect(result?.metatype).toEqual({
                name: '工作狂',
                description: '过度专注于使命象限'
            });
        });

        it('should parse multiline JSON without code block', () => {
            const content = `评估完成。

[ASSESSMENT_COMPLETE]
{
  "metatype": {"name": "整合者", "description": "平衡发展"},
  "lifestyleArchetype": {"type": "Integrated", "description": "所有象限均衡"},
  "quadrants": [
    {"quadrant": "Mind", "level": "Individualist", "levelNumber": 2}
  ]
}`;

            const result = extractAndParseAssessmentJson(content);
            expect(result).not.toBeNull();
            expect(result?.metatype).toEqual({ name: '整合者', description: '平衡发展' });
            expect(result?.lifestyleArchetype).toEqual({ type: 'Integrated', description: '所有象限均衡' });
        });

        it('should handle JSON with control characters', () => {
            // 模拟流式传输中可能出现的控制字符
            const content = `[ASSESSMENT_COMPLETE]
{"metatype": {"name": "测试\u0000类型", "description": "包含\u001F控制字符"}}`;

            const result = extractAndParseAssessmentJson(content);
            expect(result).not.toBeNull();
            expect(result?.metatype?.name).toBe('测试类型');
        });

        it('should parse complex nested JSON structure', () => {
            const content = `[ASSESSMENT_COMPLETE]
{
  "metatype": {"name": "复杂型", "description": "测试"},
  "quadrants": [
    {
      "quadrant": "Mind",
      "level": "Synthesist",
      "levelNumber": 3,
      "phase": "Discovery",
      "phaseNumber": 3,
      "strengths": ["元认知能力强", "批判性思维"],
      "gaps": ["知识应用不足"],
      "traits": {"Knowledge": "High", "Experience": "Medium", "Skill": "Low"}
    }
  ],
  "strategies": {
    "thirtyDays": {
      "title": "30天计划",
      "practices": ["每日反思", "阅读挑战"]
    }
  }
}`;

            const result = extractAndParseAssessmentJson(content);
            expect(result).not.toBeNull();
            expect(result?.quadrants).toHaveLength(1);
            expect((result?.quadrants as Array<Record<string, unknown>>)[0].quadrant).toBe('Mind');
            expect((result?.quadrants as Array<Record<string, unknown>>)[0].strengths).toContain('元认知能力强');
        });

        it('should handle marker with extra whitespace', () => {
            const content = `总结完毕。

[ASSESSMENT_COMPLETE]   

{"metatype": {"name": "空白测试", "description": "处理额外空白"}}`;

            const result = extractAndParseAssessmentJson(content);
            expect(result).not.toBeNull();
            expect(result?.metatype?.name).toBe('空白测试');
        });
    });
});

describe('Think Tag Filtering', () => {
    // 模拟过滤 <think> 标签的逻辑
    function filterThinkTags(content: string): string {
        return content
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/<think>[\s\S]*$/gi, '');
    }

    it('should remove complete think tags', () => {
        const content = '开始<think>这是思考过程</think>结束';
        expect(filterThinkTags(content)).toBe('开始结束');
    });

    it('should remove multiline think tags', () => {
        const content = `回答开始
<think>
这是多行
思考过程
包含换行
</think>
回答结束`;
        expect(filterThinkTags(content).trim()).toBe('回答开始\n\n回答结束');
    });

    it('should remove unclosed think tags (streaming)', () => {
        const content = '部分回答<think>正在思考中...';
        expect(filterThinkTags(content)).toBe('部分回答');
    });

    it('should handle multiple think tags', () => {
        const content = '第一部分<think>思考1</think>中间<think>思考2</think>最后';
        expect(filterThinkTags(content)).toBe('第一部分中间最后');
    });

    it('should preserve content without think tags', () => {
        const content = '这是普通内容，没有思考标签。';
        expect(filterThinkTags(content)).toBe('这是普通内容，没有思考标签。');
    });
});

describe('Message Content Cleaning', () => {
    // 模拟 MessageBubble 中的内容清理逻辑
    function cleanDisplayContent(content: string): string {
        return content
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/<think>[\s\S]*$/gi, '')
            .replace(/\[ASSESSMENT_COMPLETE\][\s\S]*$/, '')
            .trim();
    }

    it('should remove ASSESSMENT_COMPLETE marker and JSON', () => {
        const content = `这是评估总结。
[ASSESSMENT_COMPLETE]
{"metatype": {"name": "测试"}}`;

        expect(cleanDisplayContent(content)).toBe('这是评估总结。');
    });

    it('should remove both think tags and ASSESSMENT_COMPLETE', () => {
        const content = `<think>思考过程</think>
评估已完成，以下是您的结果总结。
[ASSESSMENT_COMPLETE]
{"result": "data"}`;

        expect(cleanDisplayContent(content)).toBe('评估已完成，以下是您的结果总结。');
    });

    it('should return empty string for content with only markers', () => {
        const content = `<think>只有思考</think>
[ASSESSMENT_COMPLETE]
{}`;

        expect(cleanDisplayContent(content)).toBe('');
    });
});
