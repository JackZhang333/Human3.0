'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface NextStepsProps {
    result: Partial<AssessmentResult>;
}

export default function NextSteps({ result }: NextStepsProps) {
    const { language } = useLanguage();

    return (
        <>
            {/* Immediate Next Action */}
            {result.immediateNextAction && (
                <section className="mb-12">
                    <div
                        className="card relative overflow-hidden lg:p-12"
                        style={{ borderLeft: '4px solid var(--success)' }}
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--success)] opacity-[0.03] rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                        <div className="relative z-10">
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                                    <ArrowRight className="w-5 h-5 text-[var(--success)]" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                                        {language === 'zh' ? '立即行动' : 'Take Action'}
                                    </p>
                                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                        {language === 'zh' ? '你的下一步行动' : 'Your Immediate Next Step'}
                                    </h2>
                                </div>
                            </div>

                            {/* Content */}
                            <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-[var(--text-primary)] leading-relaxed lg:max-w-4xl">
                                {result.immediateNextAction}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Truth About Situation */}
            {result.truthAboutSituation && (
                <section className="mb-12">
                    <div className="card bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg-primary)] border-[var(--border-subtle)] lg:p-12">
                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--quadrant-spirit)]/20 to-[var(--quadrant-spirit)]/5 flex items-center justify-center">
                                <Lightbulb className="w-5 h-5 text-[var(--quadrant-spirit)]" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                                    {language === 'zh' ? '深刻洞察' : 'Deep Insight'}
                                </p>
                                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                    {language === 'zh' ? '关于你的真相' : 'The Truth About Your Situation'}
                                </h2>
                            </div>
                        </div>

                        {/* Content */}
                        <blockquote className="text-lg lg:text-xl text-[var(--text-secondary)] leading-relaxed whitespace-pre-line italic lg:max-w-4xl">
                            "{result.truthAboutSituation}"
                        </blockquote>
                    </div>
                </section>
            )}

            {/* Comparable Metatypes */}
            {result.comparableMetatypes && result.comparableMetatypes.length > 0 && (
                <section className="text-center py-8">
                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-4">
                        {language === 'zh' ? '相似元类型' : 'Comparable Metatypes'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {result.comparableMetatypes.map((meta, i) => (
                            <span
                                key={i}
                                className="text-sm text-[var(--text-secondary)] px-4 py-2 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-primary)] transition-colors"
                            >
                                {meta}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
