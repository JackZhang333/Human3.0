'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteAssessment, regenerateAssessmentReport } from '@/app/history/actions';

interface HistoryListProps {
    initialAssessments: any[];
}

export default function HistoryList({ initialAssessments }: HistoryListProps) {
    const [assessments, setAssessments] = useState(initialAssessments);
    const [loadingStates, setLoadingStates] = useState<Record<string, 'deleting' | 'regenerating' | null>>({});

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这条评估记录吗？此操作不可撤销。')) return;

        setLoadingStates(prev => ({ ...prev, [id]: 'deleting' }));
        try {
            await deleteAssessment(id);
            setAssessments(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
            alert('删除失败，请稍后重试');
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleRegenerate = async (id: string) => {
        setLoadingStates(prev => ({ ...prev, [id]: 'regenerating' }));
        try {
            await regenerateAssessmentReport(id);
            alert('报告重构成功！');
            // 由于 revalidatePath，刷新页面可能更有用，但在客户端我们也可以手动更新状态或通知用户
            window.location.reload();
        } catch (error: any) {
            console.error('Regenerate error:', error);
            alert(`重构失败: ${error.message}`);
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
        }
    };

    if (assessments.length === 0) {
        return (
            <div className="glass p-12 rounded-2xl text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold mb-2">还没有评估记录</h2>
                <p className="text-[var(--text-secondary)] mb-6">
                    开始你的第一次 Human 3.0 发展评估
                </p>
                <Link href="/assess" className="btn-primary inline-block">
                    开始评估
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {assessments.map((assessment) => {
                const result = assessment.result as { metatype?: { name: string } } | null;
                const metatypeName = result?.metatype?.name;
                const isLoading = loadingStates[assessment.id];

                return (
                    <div
                        key={assessment.id}
                        className="card flex items-center justify-between group hover:border-[var(--gradient-start)]/50 transition-all"
                    >
                        <Link
                            href={assessment.status === 'completed' ? `/report/${assessment.id}` : '/assess'}
                            className="flex-1 flex items-center gap-4"
                        >
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${assessment.status === 'completed'
                                    ? 'gradient-bg'
                                    : 'bg-amber-500/20'
                                    }`}
                            >
                                {assessment.status === 'completed' ? (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium group-hover:text-[var(--gradient-start)] transition-colors">
                                    {assessment.status === 'completed'
                                        ? metatypeName || '评估完成'
                                        : '进行中的评估'}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {new Date(assessment.created_at).toLocaleString('zh-CN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 mr-2">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${assessment.status === 'completed'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-amber-500/20 text-amber-400'
                                        }`}
                                >
                                    {assessment.status === 'completed' ? '已完成' : '进行中'}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleRegenerate(assessment.id)}
                                    disabled={!!isLoading}
                                    title="重新生成报告"
                                    className="p-2 rounded-lg hover:bg-blue-500/10 text-[var(--text-muted)] hover:text-blue-400 transition-colors disabled:opacity-50"
                                >
                                    {isLoading === 'regenerating' ? (
                                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(assessment.id)}
                                    disabled={!!isLoading}
                                    title="删除记录"
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors disabled:opacity-50"
                                >
                                    {isLoading === 'deleting' ? (
                                        <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <Link
                                href={assessment.status === 'completed' ? `/report/${assessment.id}` : '/assess'}
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
