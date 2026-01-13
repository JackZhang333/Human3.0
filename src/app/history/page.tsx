import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import HistoryList from '@/components/history/HistoryList';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/history');
    }

    // Get all assessments for user
    const { data: assessments } = await supabase
        .from('assessments')
        .select('id, status, created_at, result')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen">
            {/* 背景装饰 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* 顶部导航 */}
            <header className="relative z-10 px-4 py-3 border-b border-[var(--border)]">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center font-bold text-white text-sm">
                            H3
                        </div>
                        <span className="font-semibold hidden sm:inline">评估历史</span>
                    </Link>

                    <Link href="/assess" className="btn-primary text-sm py-2 px-4">
                        新评估
                    </Link>
                </div>
            </header>

            {/* 内容 */}
            <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">我的评估历史</h1>

                <HistoryList initialAssessments={assessments || []} />
            </main>
        </div>
    );
}
