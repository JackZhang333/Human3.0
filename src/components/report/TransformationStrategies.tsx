'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Compass } from 'lucide-react';

interface TransformationStrategiesProps {
    result: Partial<AssessmentResult>;
}

export default function TransformationStrategies({ result }: TransformationStrategiesProps) {
    const { language } = useLanguage();

    if (!result.strategies) return null;

    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                >
                    <Compass className="w-5 h-5" />
                </span>
                {language === 'zh' ? '转变策略' : 'Transformation Strategies'}
            </h2>

            <div className="space-y-6">
                {/* 30 Days */}
                <div className="card border-l-4 border-l-[var(--quadrant-mind)]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                        <div className="flex-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--quadrant-mind)] mb-1 block">
                                {language === 'zh' ? '第一阶段' : 'Phase 1'}
                            </span>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                {result.strategies.thirtyDays.title}
                            </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium dark:bg-indigo-900/30 dark:text-indigo-400 whitespace-nowrap">
                            {language === 'zh' ? '30天' : '30 Days'}
                        </span>
                    </div>

                    {result.strategies.thirtyDays.coreProblem && (
                        <p className="text-sm text-[var(--text-secondary)] mb-4 p-3 bg-[var(--bg-subtle)] rounded-lg">
                            <strong className="text-[var(--text-primary)]">{language === 'zh' ? '核心问题：' : 'Core Problem: '}</strong>
                            {result.strategies.thirtyDays.coreProblem}
                        </p>
                    )}

                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                            {language === 'zh' ? '关键实践' : 'Key Practices'}
                        </h4>
                        <ul className="space-y-2">
                            {result.strategies.thirtyDays.practices.map((practice, i) => (
                                <li key={i} className="text-sm flex items-start gap-2.5">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--quadrant-mind)] flex-shrink-0"></span>
                                    <span className="text-[var(--text-primary)] leading-relaxed">{practice}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                        <div>
                            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
                                {language === 'zh' ? '每周挑战' : 'Weekly Challenge'}
                            </span>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {result.strategies.thirtyDays.challenge}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
                                {language === 'zh' ? '成功指标' : 'Success Metric'}
                            </span>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {result.strategies.thirtyDays.milestone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 90 Days */}
                <div className="card border-l-4 border-l-purple-400">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                        <div className="flex-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-1 block">
                                {language === 'zh' ? '第二阶段' : 'Phase 2'}
                            </span>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                {result.strategies.ninetyDays.title}
                            </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium dark:bg-purple-900/30 dark:text-purple-400 whitespace-nowrap">
                            {language === 'zh' ? '90天' : '90 Days'}
                        </span>
                    </div>

                    <ul className="space-y-2 mb-4">
                        {result.strategies.ninetyDays.practices.map((practice, i) => (
                            <li key={i} className="text-sm flex items-start gap-2.5">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                                <span className="text-[var(--text-primary)] leading-relaxed">{practice}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
                            {language === 'zh' ? '里程碑' : 'Milestone'}
                        </span>
                        <p className="text-sm text-[var(--text-secondary)]">
                            {result.strategies.ninetyDays.milestone}
                        </p>
                    </div>
                </div>

                {/* 6-12 Months */}
                <div className="card border-l-4 border-l-amber-400">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                        <div className="flex-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1 block">
                                {language === 'zh' ? '第三阶段' : 'Phase 3'}
                            </span>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                {result.strategies.sixToTwelveMonths.title}
                            </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap">
                            {language === 'zh' ? '6-12个月' : '6-12 Months'}
                        </span>
                    </div>

                    <ul className="space-y-2 mb-4">
                        {result.strategies.sixToTwelveMonths.practices.map((practice, i) => (
                            <li key={i} className="text-sm flex items-start gap-2.5">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                <span className="text-[var(--text-primary)] leading-relaxed">{practice}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
                            {language === 'zh' ? '长期目标' : 'Long-term Goal'}
                        </span>
                        <p className="text-sm text-[var(--text-secondary)]">
                            {result.strategies.sixToTwelveMonths.milestone}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
