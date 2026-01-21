'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Message, Quadrant, QuadrantLabels } from '@/lib/types';
import { getInitialMessage, QUADRANT_ORDER } from '@/lib/prompts';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import QuadrantProgress from './QuadrantProgress';
import { useToast } from '@/contexts/ToastContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

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
    const { t, language } = useLanguage();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(
        initialMessages || [
            {
                id: '1',
                role: 'assistant',
                content: getInitialMessage(language),
                timestamp: new Date(),
            },
        ]
    );
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuadrant, setCurrentQuadrant] = useState<Quadrant>('Mind');
    const [completedQuadrants, setCompletedQuadrants] = useState<Quadrant[]>([]);
    const [streamingContent, setStreamingContent] = useState('');
    const { showToast } = useToast();

    // Dialog states
    const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
    const [readyToView, setReadyToView] = useState(false);
    const [reportResult, setReportResult] = useState<unknown>(null);
    const generationTimerRef = useRef<NodeJS.Timeout | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingContent, scrollToBottom]);

    // Timer logic for long generation
    useEffect(() => {
        const isGeneratingReport = isLoading && completedQuadrants.length >= 4;

        if (isGeneratingReport) {
            // Start timer if not already running
            if (!generationTimerRef.current) {
                generationTimerRef.current = setTimeout(() => {
                    setShowTimeoutDialog(true);
                }, 2000); // 2 seconds threshold
            }
        } else {
            // Clear timer if loading stops or criteria not met
            if (generationTimerRef.current) {
                clearTimeout(generationTimerRef.current);
                generationTimerRef.current = null;
            }
        }

        return () => {
            if (generationTimerRef.current) {
                clearTimeout(generationTimerRef.current);
            }
        };
    }, [isLoading, completedQuadrants.length]);

    // Detect quadrant changes based on AI responses
    useEffect(() => {
        const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
        if (!lastAssistantMessage) return;

        const content = lastAssistantMessage.content.toLowerCase();

        // Simple quadrant detection based on keywords
        if ((content.includes('身体') || content.includes('body')) && (content.includes('象限') || content.includes('quadrant')) && currentQuadrant === 'Mind') {
            setCompletedQuadrants(prev => {
                if (prev.includes('Mind')) return prev;
                return [...prev, 'Mind'];
            });
            setCurrentQuadrant('Body');
        } else if ((content.includes('精神') || content.includes('spirit')) && (content.includes('象限') || content.includes('quadrant')) && currentQuadrant === 'Body') {
            setCompletedQuadrants(prev => {
                if (prev.includes('Body')) return prev;
                return [...prev, 'Body'];
            });
            setCurrentQuadrant('Spirit');
        } else if ((content.includes('使命') || content.includes('vocation')) && (content.includes('象限') || content.includes('quadrant')) && currentQuadrant === 'Spirit') {
            setCompletedQuadrants(prev => {
                if (prev.includes('Spirit')) return prev;
                return [...prev, 'Spirit'];
            });
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

            if (jsonStr) {
                try {
                    // 清理 JSON 字符串
                    // 移除未转义的控制字符
                    let cleanJson = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
                    // 规范化换行符
                    cleanJson = cleanJson.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

                    let result: unknown;
                    try {
                        result = JSON.parse(cleanJson);
                    } catch {
                        // 如果直接解析失败，尝试转义换行符后解析
                        cleanJson = cleanJson.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
                        result = JSON.parse(cleanJson);
                    }

                    setReportResult(result);

                    // If dialog is open, update state to ready
                    if (showTimeoutDialog) {
                        setReadyToView(true);
                        showToast('🎉 评估报告已生成！', 'success', 3000);
                    } else {
                        // Directly complete if no dialog
                        showToast('🎉 评估报告生成成功！正在跳转...', 'success', 3000);
                        if (onComplete) onComplete(result);
                    }

                } catch (e) {
                    console.error('Failed to parse assessment result:', e);
                    showToast(t('report.error'), 'error');
                }
            }
        }
    }, [messages, currentQuadrant, onComplete, showTimeoutDialog, t, showToast]);

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

        // Optimistic update for Vocation (final quadrant) to trigger generation UI
        if (currentQuadrant === 'Vocation') {
            setCompletedQuadrants(prev => {
                if (prev.includes('Vocation')) return prev;
                return [...prev, 'Vocation'];
            });
        }

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
                    lang: language,
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
                let errorMessage = t('common.error');

                if (error instanceof Error) {
                    if (error.message.includes('timeout') || error.message.includes('504')) {
                        errorMessage = language === 'zh' ? '请求超时了。生成完整报告需要较长时间，请重新发送您的回答。' : 'Request timeout. Generating full report takes time, please resend your answer.';
                    } else if (error.message.includes('network') || error.message.includes('fetch')) {
                        errorMessage = language === 'zh' ? '网络连接出现问题，请检查网络后重试。' : 'Network connection issue, please check and retry.';
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

    const handleViewReport = () => {
        if (onComplete && reportResult) {
            onComplete(reportResult);
        } else if (assessmentId) {
            // Fallback just in case
            router.push(`/report/${assessmentId}`);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* 进度指示器 */}
            <div className="flex-shrink-0 px-6 py-6 transition-all duration-300">
                <QuadrantProgress
                    currentQuadrant={currentQuadrant}
                    completedQuadrants={completedQuadrants}
                />
            </div>

            {/* 消息列表 - 可滚动区域 */}
            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-8 space-y-8 scroll-smooth scrollbar-thin scrollbar-thumb-black/5 scrollbar-track-transparent">
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
                    <div className="flex flex-col gap-3 px-2 py-4 animate-slide-up">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5 p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-sm">
                                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full typing-dot" />
                                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full typing-dot" />
                                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full typing-dot" />
                            </div>
                            <span className="text-sm font-medium text-[var(--text-secondary)] tracking-tight">
                                {language === 'zh' ? 'HUMAN 3.0 正在分析...' : 'HUMAN 3.0 is analyzing...'}
                            </span>
                        </div>
                        {completedQuadrants.length >= 3 && (
                            <p className="text-xs text-[var(--text-muted)] font-medium ml-12 italic">
                                {language === 'zh' ? '正在生成全维度生命评估报告，由于数据量较大，约需 60-90 秒...' : 'Generating multi-dimensional assessment report, this may take 60-90 seconds...'}
                            </p>
                        )}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 输入框 - 浮动并具备玻璃拟态 */}
            <div className="flex-shrink-0 px-6 py-10">
                {isLoading && completedQuadrants.length >= 4 ? (
                    <div className="flex items-center justify-center p-4 text-[var(--text-secondary)] italic animate-pulse">
                        {language === 'zh' ? '正在生成最终报告...' : 'Finalizing Report...'}
                    </div>
                ) : (
                    <ChatInput
                        onSend={sendMessage}
                        onStop={handleStop}
                        isLoading={isLoading}
                        placeholder={language === 'zh' ? `输入关于${QuadrantLabels[currentQuadrant]}的见解...` : `Share insights on ${currentQuadrant}...`}
                    />
                )}
            </div>

            {/* Long Generation Timeout Dialog */}
            <AlertDialog open={showTimeoutDialog} onOpenChange={setShowTimeoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {readyToView
                                ? (language === 'zh' ? '评估报告已就绪' : 'Report Ready')
                                : (language === 'zh' ? '正在深度生成中...' : 'Generating Report...')
                            }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {readyToView
                                ? (language === 'zh' ? '您的全维度生命评估报告已生成完毕。' : 'Your multi-dimensional assessment report is ready.')
                                : (language === 'zh'
                                    ? '生成全维度详细报告需要一些时间（约1-2分钟）。您可以继续在此等待，或稍后在"历史记录"中查看。'
                                    : 'Generating a detailed report takes time (1-2 mins). You can wait here or check "History" later.')
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {readyToView ? (
                            <AlertDialogAction onClick={handleViewReport}>
                                {language === 'zh' ? '立即查看报告' : 'View Report Now'}
                            </AlertDialogAction>
                        ) : (
                            <>
                                <AlertDialogCancel onClick={() => router.push('/history')}>
                                    {language === 'zh' ? '去历史记录等待' : 'Check History Later'}
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={() => setShowTimeoutDialog(false)}>
                                    {language === 'zh' ? '继续等待' : 'Keep Waiting'}
                                </AlertDialogAction>
                            </>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
