'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, AlertTriangle } from 'lucide-react';

interface GlitchAndWarningsProps {
    result: Partial<AssessmentResult>;
}

export default function GlitchAndWarnings({ result }: GlitchAndWarningsProps) {
    const { language } = useLanguage();

    return (
        <>
            {/* Glitch Assessment */}
            {result.glitchAssessment && (
                <section className="mb-12">
                    <div className="card relative overflow-hidden lg:p-10">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--quadrant-mind)] opacity-[0.03] rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                        <div className="relative z-10">
                            {/* Section Header */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--quadrant-mind)]/20 to-[var(--quadrant-mind)]/5 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-[var(--quadrant-mind)]" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                                        {language === 'zh' ? '系统诊断' : 'System Diagnosis'}
                                    </p>
                                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                        {language === 'zh' ? 'Glitch 评估' : 'Glitch Assessment'}
                                    </h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-sm lg:prose-base max-w-none text-[var(--text-secondary)] leading-relaxed whitespace-pre-line lg:text-lg">
                                {result.glitchAssessment}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Critical Warnings */}
            {result.criticalWarnings && result.criticalWarnings.length > 0 && (
                <section className="mb-12">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--error)]/20 to-[var(--error)]/5 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-[var(--error)]" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                                {language === 'zh' ? '重要提醒' : 'Important Reminders'}
                            </p>
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '关键警告' : 'Critical Warnings'}
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {result.criticalWarnings.map((warning, i) => (
                            <div
                                key={i}
                                className="p-6 lg:p-8 rounded-xl bg-[var(--error-subtle)] border border-[var(--error)]/10"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-[var(--error)] text-xl flex-shrink-0">⚠</span>
                                    <p className="text-[var(--error)]/90 leading-relaxed lg:text-lg">{warning}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
