import { Message } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    // Clean content - remove think tags and assessment complete marker from display
    const displayContent = message.content
        // 移除 <think>...</think> 标签及其内容（支持跨行）
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        // 移除未闭合的 <think> 标签开始部分（流式传输中的情况）
        .replace(/<think>[\s\S]*$/gi, '')
        // 移除评估完成标记
        .replace(/\[ASSESSMENT_COMPLETE\][\s\S]*$/, '')
        .trim();

    if (!displayContent) return null;

    return (
        <div
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
        >
            <div
                className={`max-w-[85%] md:max-w-[75%] px-4 py-3 ${isUser ? 'message-user' : 'message-assistant'
                    }`}
            >
                {isUser ? (
                    <p className="text-sm md:text-base whitespace-pre-wrap">{displayContent}</p>
                ) : (
                    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                    <p className="mb-2 last:mb-0 text-sm md:text-base leading-relaxed">
                                        {children}
                                    </p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-semibold text-[var(--text-primary)]">
                                        {children}
                                    </strong>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside mb-2 space-y-1">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-inside mb-2 space-y-1">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="text-sm md:text-base">{children}</li>
                                ),
                                h1: ({ children }) => (
                                    <h1 className="text-xl font-bold mb-3 gradient-text">{children}</h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-base font-semibold mb-2 text-[var(--text-primary)]">
                                        {children}
                                    </h3>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-2 border-[var(--gradient-start)] pl-4 my-2 text-[var(--text-secondary)] italic">
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ children }) => (
                                    <code className="bg-[var(--surface)] px-1.5 py-0.5 rounded text-sm font-mono">
                                        {children}
                                    </code>
                                ),
                            }}
                        >
                            {displayContent}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
