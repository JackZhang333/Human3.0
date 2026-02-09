import { useState } from 'react';
import Link from 'next/link';
import { deleteAssessment, regenerateAssessmentReport } from '@/app/history/actions';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { AVAILABLE_PROVIDERS } from '@/lib/ai/factory';
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
    Sparkles,
    Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HistoryListProps {
    initialAssessments: any[];
}

export default function HistoryList({ initialAssessments }: HistoryListProps) {
    const { t, language } = useLanguage();
    const { showToast } = useToast();
    const [assessments, setAssessments] = useState(initialAssessments);
    const [loadingStates, setLoadingStates] = useState<Record<string, 'deleting' | 'regenerating' | null>>({});
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [regenerateId, setRegenerateId] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>('minimax');

    const handleDelete = async (id: string) => {
        setLoadingStates(prev => ({ ...prev, [id]: 'deleting' }));
        try {
            await deleteAssessment(id);
            setAssessments(prev => prev.filter(a => a.id !== id));
            setDeleteId(null);
            showToast(language === 'zh' ? '删除成功' : 'Deleted successfully', 'success');
        } catch (error) {
            console.error('Delete error:', error);
            showToast(language === 'zh' ? '删除失败，请稍后重试' : 'Delete failed, please try again later', 'error');
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleRegenerate = async (id: string, modelId: string) => {
        setLoadingStates(prev => ({ ...prev, [id]: 'regenerating' }));
        try {
            await regenerateAssessmentReport(id, modelId);
            showToast(language === 'zh' ? '报告重构成功！' : 'Report regenerated successfully!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error: any) {
            console.error('Regenerate error:', error);
            showToast(`${language === 'zh' ? '重构失败' : 'Regeneration failed'}: ${error.message}`, 'error');
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
            setRegenerateId(null);
        }
    };

    if (assessments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-24 h-24 rounded-3xl bg-[var(--bg-subtle)] flex items-center justify-center mb-6 shadow-sm border border-[var(--border-subtle)]">
                    <FileText className="w-10 h-10 text-[var(--text-tertiary)]" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">{t('history.noHistory')}</h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md leading-relaxed">
                    {language === 'zh' ? '开始你的第一次 Human 3.0 发展评估，探索你的内在潜能。' : 'Start your first Human 3.0 development assessment to explore your inner potential.'}
                </p>
                <Link href="/assess" passHref>
                    <Button size="lg" className="rounded-full gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t('nav.startAssessment')}
                        <ChevronRight className="w-4 h-4 opacity-50" />
                    </Button>
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
                    <Card
                        key={assessment.id}
                        className="w-full overflow-hidden border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 group"
                    >
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:p-5 gap-4 w-full min-w-0 overflow-hidden">
                            <Link
                                href={isCompleted ? `/report/${assessment.id}` : '/assess'}
                                className="w-full sm:flex-1 flex items-center gap-4 sm:gap-6 min-w-0"
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${isCompleted
                                        ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] group-hover:scale-105'
                                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-7 h-7" />
                                    ) : (
                                        <Hourglass className="w-7 h-7 animate-pulse" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5 min-w-0">
                                        <h3 className="font-bold text-lg text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors min-w-0 flex-shrink">
                                            {isCompleted
                                                ? metatypeName || t('history.completed')
                                                : t('history.inProgress')}
                                        </h3>
                                        <span
                                            className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap ${isCompleted
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

                            <div className="flex items-center gap-2 pt-4 sm:pt-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-[var(--border-subtle)] justify-end w-full sm:w-auto">
                                <AlertDialog open={regenerateId === assessment.id} onOpenChange={(open) => !open && setRegenerateId(null)}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setRegenerateId(assessment.id);
                                            }}
                                            disabled={!!isLoading}
                                            title={language === 'zh' ? '重新生成' : 'Regenerate'}
                                            className="rounded-xl hover:bg-[var(--accent-subtle)] hover:text-[var(--accent-primary)]"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${isLoading === 'regenerating' ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent onClick={(e) => e.stopPropagation()} className="max-w-[95vw] sm:max-w-md rounded-3xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-2xl">
                                                {t('history.regenerateConfirm')}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="pt-4">
                                                <div className="grid gap-3">
                                                    {AVAILABLE_PROVIDERS.map((provider) => (
                                                        <button
                                                            key={provider.id}
                                                            onClick={() => setSelectedModel(provider.id)}
                                                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedModel === provider.id
                                                                ? 'border-[var(--accent-primary)] bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                                                                : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)] bg-[var(--bg-subtle)]'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2.5 rounded-xl ${selectedModel === provider.id ? 'bg-white' : 'bg-white dark:bg-gray-800'}`}>
                                                                    <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
                                                                </div>
                                                                <div className="flex flex-col items-start">
                                                                    <span className="font-bold">{provider.name}</span>
                                                                    <span className="text-[10px] opacity-60 uppercase tracking-widest">{provider.version}</span>
                                                                </div>
                                                            </div>
                                                            {selectedModel === provider.id && (
                                                                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-8">
                                            <AlertDialogCancel className="rounded-2xl border-none bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)]">
                                                {t('common.cancel')}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleRegenerate(assessment.id, selectedModel)}
                                                asChild
                                            >
                                                <Button className="rounded-2xl min-w-24">
                                                    {t('common.confirm')}
                                                </Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog open={deleteId === assessment.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDeleteId(assessment.id);
                                            }}
                                            disabled={!!isLoading}
                                            title={language === 'zh' ? '删除记录' : 'Delete record'}
                                            className="rounded-xl hover:bg-red-50 hover:text-red-600"
                                        >
                                            {isLoading === 'deleting' ? (
                                                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent onClick={(e) => e.stopPropagation()} className="max-w-[95vw] sm:max-w-md rounded-3xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-2xl">
                                                {language === 'zh' ? '确认删除？' : 'Confirm Delete?'}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-base pt-2">
                                                {t('history.deleteConfirm')}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-8">
                                            <AlertDialogCancel className="rounded-2xl border-none bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)]">
                                                {t('common.cancel')}
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(assessment.id)}
                                                asChild
                                            >
                                                <Button variant="destructive" className="rounded-2xl min-w-24">
                                                    {t('common.delete')}
                                                </Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <Link
                                    href={isCompleted ? `/report/${assessment.id}` : '/assess'}
                                    className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all group-hover:translate-x-1"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
