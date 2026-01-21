'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRightCircle, Lightbulb } from 'lucide-react';

interface NextStepsProps {
    result: Partial<AssessmentResult>;
}

export default function NextSteps({ result }: NextStepsProps) {
    const { language } = useLanguage();

    return (
        <>
            {/* 立即行动 */}
            <section
                className="card mb-8 border-2 !border-[var(--success)] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-24 bg-[var(--success)] opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 relative z-10">
                    <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                        <ArrowRightCircle className="w-5 h-5" />
                    </span>
                    {language === 'zh' ? '你的下一步行动' : 'Your Immediate Next Step'}
                </h2>
                <p className="text-xl font-medium text-[var(--text-primary)] leading-relaxed relative z-10">
                    {result.immediateNextAction}
                </p>
            </section>

            {/* 真相 */}
            <section className="card bg-[var(--bg-subtle)] border-none">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                        <Lightbulb className="w-5 h-5" />
                    </span>
                    {language === 'zh' ? '关于你的真相' : 'The Truth About Your Situation'}
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line italic">
                    &ldquo;{result.truthAboutSituation}&rdquo;
                </p>
            </section>

            {/* 类似元类型 */}
            {result.comparableMetatypes && result.comparableMetatypes.length > 0 && (
                <section className="mt-12 text-center">
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                        {language === 'zh' ? '相似元类型' : 'Comparable Metatypes'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {result.comparableMetatypes.map((meta, i) => (
                            <span key={i} className="text-sm text-[var(--text-secondary)] px-3 py-1 rounded-full bg-[var(--bg-subtle)]">
                                {meta}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
