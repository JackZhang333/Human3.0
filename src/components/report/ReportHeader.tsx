'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

interface ReportHeaderProps {
    assessment: {
        created_at: string;
    };
    result: Partial<AssessmentResult>;
}

export default function ReportHeader({ assessment, result }: ReportHeaderProps) {
    const { language } = useLanguage();

    return (
        <section className="text-center mb-16 sm:mb-20">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[var(--text-secondary)] mb-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                <span>
                    {language === 'zh' ? '评估完成于' : 'Assessment completed on'} {new Date(assessment.created_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
                </span>
            </div>

            {/* Main Title */}
            <div className="mb-6">
                <p className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-4">
                    {language === 'zh' ? '你的元类型' : 'Your Metatype'}
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
                    <span
                        className="bg-gradient-to-r from-[var(--quadrant-mind)] via-[var(--quadrant-spirit)] to-[var(--quadrant-mind)] bg-clip-text text-transparent"
                        style={{
                            backgroundSize: '200% auto',
                            animation: 'gradient 8s linear infinite',
                        }}
                    >
                        {result.metatype?.name}
                    </span>
                </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed px-4 sm:px-0 mb-4">
                {result.metatype?.description}
            </p>

            {/* Decorative line */}
            <div className="mt-12 flex justify-center">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--border-primary)] to-transparent" />
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% center; }
                    100% { background-position: 200% center; }
                }
            `}</style>
        </section>
    );
}
