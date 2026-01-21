'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatInputProps {
    onSend: (message: string) => void;
    onStop?: () => void;
    isLoading: boolean;
    placeholder?: string;
}

export default function ChatInput({
    onSend,
    onStop,
    isLoading,
    placeholder,
}: ChatInputProps) {
    const { t } = useLanguage();
    const defaultPlaceholder = placeholder || t('assess.inputPlaceholder');
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto w-full group">
            <div className="flex items-end gap-3 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-3 shadow-xl shadow-black/5 transition-all focus-within:shadow-2xl focus-within:shadow-black/5 focus-within:border-white/80">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={defaultPlaceholder}
                    className="flex-1 bg-transparent resize-none outline-none border-none focus:ring-0 text-base py-1 px-1 placeholder:text-[var(--text-tertiary)] max-h-[200px] leading-relaxed"
                    rows={1}
                    disabled={isLoading}
                />

                <div className="flex items-center pb-0.5">
                    {isLoading ? (
                        <button
                            type="button"
                            onClick={onStop}
                            className="p-2.5 bg-[var(--accent-primary)] text-white rounded-xl hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-primary)]/20 active:scale-95"
                            aria-label={t('assess.stop')}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <rect x="6" y="6" width="8" height="8" rx="1" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="p-2.5 bg-[var(--accent-primary)] text-white rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-95 shadow-lg shadow-[var(--accent-primary)]/20 active:scale-95"
                            aria-label={t('assess.send')}
                        >
                            <svg
                                className="w-5 h-5 rotate-45 -translate-y-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <div className="text-[10px] uppercase tracking-widest font-medium text-[var(--text-tertiary)] text-center mt-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                {t('assess.keyboardHint')}
            </div>
        </form>
    );
}
