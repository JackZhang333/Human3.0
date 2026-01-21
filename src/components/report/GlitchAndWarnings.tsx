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
            {/* Glitch 评估 */}
            <section className="card mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                    >
                        <Zap className="w-5 h-5" />
                    </span>
                    {language === 'zh' ? 'Glitch 评估' : 'Glitch Assessment'}
                </h2>
                <div className="prose prose-sm max-w-none text-[var(--text-secondary)]">
                    <p className="whitespace-pre-line leading-relaxed">
                        {result.glitchAssessment}
                    </p>
                </div>
            </section>

            {/* 关键警告 */}
            {result.criticalWarnings && result.criticalWarnings.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        >
                            <AlertTriangle className="w-5 h-5" />
                        </span>
                        {language === 'zh' ? '关键警告' : 'Critical Warnings'}
                    </h2>
                    <div className="space-y-3">
                        {result.criticalWarnings.map((warning, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl border bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800/30"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-red-500 mt-0.5">!</span>
                                    <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{warning}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
