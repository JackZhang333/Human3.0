'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle } from 'lucide-react';

interface CoreProblemProps {
    result: Partial<AssessmentResult>;
}

export default function CoreProblem({ result }: CoreProblemProps) {
    const { language } = useLanguage();

    if (!result.coreProblem) return null;

    return (
        <section className="card mb-8 border-2 border-[var(--quadrant-mind)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-[var(--quadrant-mind)] opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 relative z-10">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--quadrant-mind)] text-white">
                    <AlertCircle className="w-5 h-5" />
                </span>
                {language === 'zh' ? '你的核心问题' : 'Your Core Problem'}
            </h2>
            <p className="text-xl font-medium text-[var(--text-primary)] leading-relaxed relative z-10">
                {result.coreProblem}
            </p>
        </section>
    );
}
