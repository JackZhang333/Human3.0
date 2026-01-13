'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Quadrant, QuadrantLabels } from '@/lib/types';
import { getInitialMessage, QUADRANT_ORDER } from '@/lib/prompts';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import QuadrantProgress from './QuadrantProgress';
import { useToast } from '@/contexts/ToastContext';

interface ChatInterfaceProps {
    assessmentId?: string;
    initialMessages?: Message[];
    onComplete?: (result: unknown) => void;
}

export default function ChatInterface({
    assessmentId,
    initialMessages,
    onComplete,
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(
        initialMessages || [
            {
                id: '1',
                role: 'assistant',
                content: getInitialMessage(),
                timestamp: new Date(),
            },
        ]
    );
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuadrant, setCurrentQuadrant] = useState<Quadrant>('Mind');
    const [completedQuadrants, setCompletedQuadrants] = useState<Quadrant[]>([]);
    const [streamingContent, setStreamingContent] = useState('');
    const { showToast } = useToast();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingContent, scrollToBottom]);

    // Detect quadrant changes based on AI responses
    useEffect(() => {
        const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
        if (!lastAssistantMessage) return;

        const content = lastAssistantMessage.content.toLowerCase();

        // Simple quadrant detection based on keywords
        if (content.includes('身体') && content.includes('象限') && currentQuadrant === 'Mind') {
            setCompletedQuadrants(prev => [...prev, 'Mind']);
            setCurrentQuadrant('Body');
        } else if (content.includes('精神') && content.includes('象限') && currentQuadrant === 'Body') {
            setCompletedQuadrants(prev => [...prev, 'Body']);
            setCurrentQuadrant('Spirit');
        } else if (content.includes('使命') && content.includes('象限') && currentQuadrant === 'Spirit') {
            setCompletedQuadrants(prev => [...prev, 'Spirit']);
            setCurrentQuadrant('Vocation');
        }

        // Check for assessment completion
        if (lastAssistantMessage.content.includes('[ASSESSMENT_COMPLETE]')) {
            setCompletedQuadrants(['Mind', 'Body', 'Spirit', 'Vocation']);

            // Extract result JSON - try multiple patterns
            let jsonStr: string | null = null;

            // Pattern 1: Single line JSON after marker
            const singleLineMatch = lastAssistantMessage.content.match(/\[ASSESSMENT_COMPLETE\]\s*(\{[^\n]*\})/);
            if (singleLineMatch) {
                jsonStr = singleLineMatch[1];
            }

            // Pattern 2: JSON in code block
            if (!jsonStr) {
                const codeBlockMatch = lastAssistantMessage.content.match(/\[ASSESSMENT_COMPLETE\][\s\S]*?```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                if (codeBlockMatch) {
                    jsonStr = codeBlockMatch[1];
                }
            }

            // Pattern 3: Multiline JSON after marker
            if (!jsonStr) {
                const multilineMatch = lastAssistantMessage.content.match(/\[ASSESSMENT_COMPLETE\]\s*(\{[\s\S]*\})/);
                if (multilineMatch) {
                    jsonStr = multilineMatch[1];
                }
            }

            if (jsonStr && onComplete) {
                try {
                    // 清理 JSON 字符串
                    // 移除未转义的控制字符
                    let cleanJson = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
                    // 规范化换行符
                    cleanJson = cleanJson.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                    // 尝试直接解析
                    try {
                        const result = JSON.parse(cleanJson);
                        showToast('🎉 评估报告生成成功！正在跳转...', 'success', 3000);
                        onComplete(result);
                    } catch {
                        // 如果直接解析失败，尝试转义换行符后解析
                        cleanJson = cleanJson.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
                        const result = JSON.parse(cleanJson);
                        showToast('🎉 评估报告生成成功！正在跳转...', 'success', 3000);
                        onComplete(result);
                    }
                } catch (e) {
                    console.error('Failed to parse assessment result:', e);
                    console.log('Raw JSON string:', jsonStr.substring(0, 500));
                    showToast('报告解析失败，请重试', 'error');
                }
            }
        }
    }, [messages, currentQuadrant, onComplete]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setStreamingContent('');

        // Prepare messages for API
        const apiMessages = messages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content }))
            .concat({ role: 'user', content: content.trim() });

        try {
            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/assess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: apiMessages,
                    assessmentId,
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const decoder = new TextDecoder();
            let fullContent = '';

            // 辅助函数：过滤 <think> 标签
            const filterThinkTags = (content: string) => {
                return content
                    .replace(/<think>[\s\S]*?<\/think>/gi, '')
                    .replace(/<think>[\s\S]*$/gi, '');
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const json = JSON.parse(data);
                            if (json.content) {
                                fullContent += json.content;
                                // 显示时过滤 think 标签
                                setStreamingContent(filterThinkTags(fullContent));
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }

            // Add assistant message
            if (fullContent) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: fullContent,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Request aborted');
            } else {
                console.error('Chat error:', error);

                // 根据错误类型提供更有意义的错误消息
                let errorMessage = '抱歉，发生了一些问题。请稍后重试。';

                if (error instanceof Error) {
                    if (error.message.includes('timeout') || error.message.includes('504')) {
                        errorMessage = '请求超时了。生成完整报告需要较长时间，请重新发送您的回答。';
                    } else if (error.message.includes('network') || error.message.includes('fetch')) {
                        errorMessage = '网络连接出现问题，请检查网络后重试。';
                    }
                }

                // Show toast notification for error
                showToast(errorMessage, 'error', 5000);

                // Add error message
                setMessages(prev => [
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: errorMessage,
                        timestamp: new Date(),
                    },
                ]);
            }
        } finally {
            setIsLoading(false);
            setStreamingContent('');
            abortControllerRef.current = null;
        }
    };

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* 进度指示器 */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]/60 backdrop-blur-sm">
                <QuadrantProgress
                    currentQuadrant={currentQuadrant}
                    completedQuadrants={completedQuadrants}
                />
            </div>

            {/* 消息列表 - 可滚动区域 */}
            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6 space-y-4 scroll-smooth">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                {/* Streaming content */}
                {streamingContent && (
                    <MessageBubble
                        message={{
                            id: 'streaming',
                            role: 'assistant',
                            content: streamingContent,
                            timestamp: new Date(),
                        }}
                    />
                )}

                {/* Loading indicator */}
                {isLoading && !streamingContent && (
                    <div className="flex flex-col gap-2 text-[var(--text-secondary)] animate-pulse">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-[var(--gradient-start)] rounded-full typing-dot" />
                                <span className="w-2 h-2 bg-[var(--gradient-start)] rounded-full typing-dot" />
                                <span className="w-2 h-2 bg-[var(--gradient-start)] rounded-full typing-dot" />
                            </div>
                            <span className="text-sm">正在思考...</span>
                        </div>
                        {completedQuadrants.length >= 3 && (
                            <p className="text-xs text-[var(--text-muted)] ml-5">
                                正在生成完整评估报告，这可能需要 1-2 分钟...
                            </p>
                        )}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 输入框 - 固定在底部 */}
            <div className="flex-shrink-0 px-4 py-4 border-t border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
                <ChatInput
                    onSend={sendMessage}
                    onStop={handleStop}
                    isLoading={isLoading}
                    placeholder={`回答关于${QuadrantLabels[currentQuadrant]}的问题...`}
                />
            </div>
        </div>
    );
}
