'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/PageHeader';
import HistoryList from '@/components/history/HistoryList';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface Assessment {
    id: string;
    status: string;
    created_at: string;
    result: unknown;
}

export default function HistoryPage() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const supabase = createClient();
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessments = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login?redirect=/history');
                return;
            }

            const { data, error } = await supabase
                .from('assessments')
                .select('id, status, created_at, result')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching assessments:', error);
            } else {
                setAssessments(data || []);
            }
            setLoading(false);
        };

        fetchAssessments();
    }, [router, supabase]);

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
        <div className="min-h-screen flex flex-col">
            {/* 背景装饰 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* 顶部导航 */}
            <PageHeader
                title={t('history.title')}
                actions={
                    <Link href="/assess" passHref>
                        <Button size="sm" className="rounded-full shadow-lg">
                            {t('nav.startAssessment')}
                        </Button>
                    </Link>
                }
            />

            {/* 内容 */}
            <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 flex-1 overflow-x-hidden">
                <h1 className="text-2xl font-bold mb-6 truncate">{t('history.title')}</h1>

                <HistoryList initialAssessments={assessments || []} />
            </main>
        </div>
    );
}
