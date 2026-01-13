'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ChatInterface from '@/components/chat/ChatInterface';
import Link from 'next/link';
import { Message } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function AssessPage() {
    const router = useRouter();
    const supabase = createClient();
    const [assessmentId, setAssessmentId] = useState<string | null>(null);
    const [initialMessages, setInitialMessages] = useState<Message[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAssessment = async () => {
            try {
                // Get current user
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/login?redirect=/assess');
                    return;
                }

                // Check for existing in-progress assessment
                const { data: existingAssessments } = await supabase
                    .from('assessments')
                    .select('id, conversation')
                    .eq('user_id', user.id)
                    .eq('status', 'in_progress')
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (existingAssessments && existingAssessments.length > 0) {
                    const existing = existingAssessments[0];
                    setAssessmentId(existing.id);

                    // 恢复之前的对话
                    if (existing.conversation && Array.isArray(existing.conversation) && existing.conversation.length > 0) {
                        console.log('Restoring conversation with', existing.conversation.length, 'messages');
                        setInitialMessages(existing.conversation.map((msg: { role: string; content: string }, index: number) => ({
                            id: String(index + 1),
                            role: msg.role as 'user' | 'assistant',
                            content: msg.content,
                            timestamp: new Date(),
                        })));
                    }
                } else {
                    // Create new assessment
                    const { data: newAssessment, error } = await supabase
                        .from('assessments')
                        .insert({
                            user_id: user.id,
                            conversation: [],
                            status: 'in_progress',
                        })
                        .select('id')
                        .single();

                    if (error) {
                        console.error('Failed to create assessment:', error);
                    } else if (newAssessment) {
                        setAssessmentId(newAssessment.id);
                    }
                }
            } catch (error) {
                console.error('Init assessment error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAssessment();
    }, [supabase, router]);

    const handleComplete = (result: unknown) => {
        console.log('Assessment complete:', result);
        // Navigate to report page
        if (assessmentId) {
            router.push(`/report/${assessmentId}`);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[var(--gradient-start)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">正在准备评估...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* 背景装饰 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* 顶部导航 */}
            <header className="relative z-10 flex-shrink-0 px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center font-bold text-white text-sm">
                            H3
                        </div>
                        <span className="font-semibold hidden sm:inline">Human 3.0 评估</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/history"
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            历史记录
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            退出
                        </button>
                    </div>
                </div>
            </header>

            {/* 聊天界面 - 占据剩余空间 */}
            <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto flex flex-col min-h-0">
                <ChatInterface
                    assessmentId={assessmentId || undefined}
                    initialMessages={initialMessages}
                    onComplete={handleComplete}
                />
            </main>
        </div>
    );
}
