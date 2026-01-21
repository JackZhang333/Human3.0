import { useState } from 'react';
import Link from 'next/link';
import { deleteAssessment, regenerateAssessmentReport } from '@/app/history/actions';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    FileText,
    Clock,
    Trash2,
    RefreshCw,
    ChevronRight,
    CheckCircle2,
    Hourglass,
    Sparkles
} from 'lucide-react';

interface HistoryListProps {
    initialAssessments: any[];
}

export default function HistoryList({ initialAssessments }: HistoryListProps) {
    const { t, language } = useLanguage();
    const [assessments, setAssessments] = useState(initialAssessments);
    const [loadingStates, setLoadingStates] = useState<Record<string, 'deleting' | 'regenerating' | null>>({});
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setLoadingStates(prev => ({ ...prev, [id]: 'deleting' }));
        try {
            await deleteAssessment(id);
            setAssessments(prev => prev.filter(a => a.id !== id));
            setDeleteId(null);
        } catch (error) {
            console.error('Delete error:', error);
            alert(language === 'zh' ? '删除失败，请稍后重试' : 'Delete failed, please try again later');
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleRegenerate = async (id: string) => {
        setLoadingStates(prev => ({ ...prev, [id]: 'regenerating' }));
        try {
            await regenerateAssessmentReport(id);
            alert('报告重构成功！');
            window.location.reload();
        } catch (error: any) {
            console.error('Regenerate error:', error);
            alert(`${language === 'zh' ? '重构失败' : 'Regeneration failed'}: ${error.message}`);
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
        }
    };

    if (assessments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 rounded-3xl bg-[var(--surface)] flex items-center justify-center mb-6 shadow-sm border border-[var(--border-subtle)]">
                    <FileText className="w-10 h-10 text-[var(--text-muted)]" />
                </div>
                <h2 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">{t('history.noHistory')}</h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md leading-relaxed">
                    {language === 'zh' ? '开始你的第一次 Human 3.0 发展评估，探索你的内在潜能。' : 'Start your first Human 3.0 development assessment to explore your inner potential.'}
                </p>
                <Link href="/assess" className="btn-primary inline-flex items-center gap-2 group">
                    <Sparkles className="w-4 h-4" />
                    {t('nav.startAssessment')}
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
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
                const isCompleted = assessment.status === 'completed';

                return (
                    <div
                        key={assessment.id}
                        className="group bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--border-hover)] hover:shadow-md transition-all duration-300 p-1"
                    >
                        <div className="flex items-center justify-between p-4">
                            <Link
                                href={isCompleted ? `/report/${assessment.id}` : '/assess'}
                                className="flex-1 flex items-center gap-5 min-w-0"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <Hourglass className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--gradient-start)] transition-colors">
                                            {isCompleted
                                                ? metatypeName || t('history.completed')
                                                : t('history.inProgress')}
                                        </h3>
                                        <span
                                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${isCompleted
                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                }`}
                                        >
                                            {isCompleted ? t('history.completed') : t('history.inProgress')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(assessment.created_at).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="flex items-center gap-2 pl-4 border-l border-[var(--border-subtle)] ml-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleRegenerate(assessment.id);
                                    }}
                                    disabled={!!isLoading}
                                    title={language === 'zh' ? '重新生成报告' : 'Regenerate report'}
                                    className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoading === 'regenerating' ? 'animate-spin' : ''}`} />
                                </button>

                                <AlertDialog open={deleteId === assessment.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDeleteId(assessment.id);
                                            }}
                                            disabled={!!isLoading}
                                            title={language === 'zh' ? '删除记录' : 'Delete record'}
                                            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading === 'deleting' ? (
                                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                {language === 'zh' ? '确认删除？' : 'Confirm Delete?'}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {t('history.deleteConfirm')}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                {language === 'zh' ? '取消' : 'Cancel'}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(assessment.id)}
                                                className="bg-red-500 hover:bg-red-600 border-none"
                                            >
                                                {language === 'zh' ? '删除' : 'Delete'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <Link
                                    href={isCompleted ? `/report/${assessment.id}` : '/assess'}
                                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
