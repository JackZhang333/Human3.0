'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target } from 'lucide-react';

interface CoreProblemProps {
    result: Partial<AssessmentResult>;
}

export default function CoreProblem({ result }: CoreProblemProps) {
    const { language } = useLanguage();

    if (!result.coreProblem) return null;

    return (
        <section className="mb-12">
            <div
                className="card relative overflow-hidden lg:p-12"
                style={{ borderLeft: '4px solid var(--quadrant-mind)' }}
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--quadrant-mind)] opacity-[0.03] rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                <div className="relative z-10">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-[var(--quadrant-mind)]/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-[var(--quadrant-mind)]" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                                {language === 'zh' ? '核心洞察' : 'Core Insight'}
                            </p>
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '你的核心问题' : 'Your Core Problem'}
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[var(--text-primary)] leading-relaxed lg:max-w-4xl">
                        "{result.coreProblem}"
                    </blockquote>
                </div>
            </div>
        </section>
    );
}
