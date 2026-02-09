'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Compass, Calendar } from 'lucide-react';

interface TransformationStrategiesProps {
    result: Partial<AssessmentResult>;
}

const phaseConfig = [
    {
        key: 'thirtyDays',
        phaseZh: '第一阶段',
        phaseEn: 'Phase 1',
        durationZh: '30天',
        durationEn: '30 Days',
        color: 'var(--quadrant-mind)',
    },
    {
        key: 'ninetyDays',
        phaseZh: '第二阶段',
        phaseEn: 'Phase 2',
        durationZh: '90天',
        durationEn: '90 Days',
        color: '#8B5CF6',
    },
    {
        key: 'sixToTwelveMonths',
        phaseZh: '第三阶段',
        phaseEn: 'Phase 3',
        durationZh: '6-12个月',
        durationEn: '6-12 Months',
        color: 'var(--quadrant-spirit)',
    },
] as const;

export default function TransformationStrategies({ result }: TransformationStrategiesProps) {
    const { language } = useLanguage();

    if (!result.strategies) return null;

    return (
        <section className="mb-12">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--success)]/20 to-[var(--success)]/5 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-[var(--success)]" />
                </div>
                <div>
                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                        {language === 'zh' ? '行动指南' : 'Action Guide'}
                    </p>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {language === 'zh' ? '转变策略' : 'Transformation Strategies'}
                    </h2>
                </div>
            </div>

            <div className="space-y-6">
                {phaseConfig.map((phase) => {
                    const strategy = result.strategies?.[phase.key as keyof typeof result.strategies];
                    if (!strategy) return null;

                    return (
                        <div
                            key={phase.key}
                            className="card relative overflow-hidden lg:p-10"
                            style={{ borderLeft: `4px solid ${phase.color}` }}
                        >
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-8 border-b border-[var(--border-subtle)]">
                                <div>
                                    <span
                                        className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                                        style={{ color: phase.color }}
                                    >
                                        {language === 'zh' ? phase.phaseZh : phase.phaseEn}
                                    </span>
                                    <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
                                        {strategy.title}
                                    </h3>
                                </div>
                                <span
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold w-fit"
                                    style={{
                                        backgroundColor: `${phase.color}15`,
                                        color: phase.color,
                                    }}
                                >
                                    <Calendar className="w-4 h-4" />
                                    {language === 'zh' ? phase.durationZh : phase.durationEn}
                                </span>
                            </div>

                            {/* Core Problem (30 days only) */}
                            {'coreProblem' in strategy && strategy.coreProblem && (
                                <div className="mb-8 p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                                    <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">
                                        {language === 'zh' ? '核心问题' : 'Core Problem'}
                                    </span>
                                    <p className="text-[var(--text-secondary)] leading-relaxed lg:text-lg">{strategy.coreProblem}</p>
                                </div>
                            )}

                            {/* Practices */}
                            <div className="mb-8">
                                <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
                                    {language === 'zh' ? '关键实践' : 'Key Practices'}
                                </h4>
                                <ul className="space-y-4">
                                    {strategy.practices.map((practice, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <span
                                                className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: phase.color }}
                                            />
                                            <span className="text-[var(--text-secondary)] leading-relaxed lg:text-lg">{practice}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Challenge & Milestone (30 days) or just Milestone */}
                            <div className={`grid gap-6 lg:gap-12 pt-8 border-t border-[var(--border-subtle)] ${'challenge' in strategy ? 'sm:grid-cols-2' : ''}`}>
                                {'challenge' in strategy && strategy.challenge && (
                                    <div>
                                        <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">
                                            {language === 'zh' ? '每周挑战' : 'Weekly Challenge'}
                                        </span>
                                        <p className="text-[var(--text-secondary)] lg:text-base leading-relaxed">{strategy.challenge}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block mb-2">
                                        {language === 'zh' ? '成功指标' : 'Success Metric'}
                                    </span>
                                    <p className="text-[var(--text-secondary)] lg:text-base leading-relaxed">{strategy.milestone}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
