'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ChatInterface from '@/components/chat/ChatInterface';
import Link from 'next/link';
import { Message } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default function AssessPage() {
    const { t } = useLanguage();
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
                    <p className="text-[var(--text-secondary)]">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[var(--bg-primary)]">
            {/* Immersive Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--quadrant-mind)]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--quadrant-body)]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-[var(--accent-primary)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[25%] bg-[var(--quadrant-spirit)]/5 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '15s' }} />
            </div>

            {/* Top Navigation */}
            <header className="relative z-20">
                <PageHeader
                    title={t('assess.title')}
                    actions={
                        <>
                            <Link
                                href="/history"
                                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/50"
                            >
                                {t('history.title')}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/50"
                            >
                                {t('common.logout')}
                            </button>
                        </>
                    }
                />
            </header>

            {/* Chat Interface - Immersive Centered Layout */}
            <main className="relative z-10 flex-1 w-full flex flex-col min-h-0">
                <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col min-h-0">
                    <ChatInterface
                        assessmentId={assessmentId || undefined}
                        initialMessages={initialMessages}
                        onComplete={handleComplete}
                    />
                </div>
            </main>
        </div>
    );
}
