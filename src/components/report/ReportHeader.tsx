'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportHeaderProps {
    assessment: {
        created_at: string;
    };
    result: Partial<AssessmentResult>;
}

export default function ReportHeader({ assessment, result }: ReportHeaderProps) {
    const { language } = useLanguage();

    return (
        <section className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[var(--text-secondary)] mb-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                {language === 'zh' ? '评估完成于' : 'Assessment completed on'} {new Date(assessment.created_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {language === 'zh' ? '你的元类型：' : 'Your Metatype:'}
                <span
                    className="block mt-2 bg-gradient-to-r from-[var(--quadrant-mind)] to-[var(--quadrant-spirit)] bg-clip-text text-transparent"
                    style={{
                        paddingBottom: '0.1em' // Fix for descenders being cut off in some browsers
                    }}
                >
                    {result.metatype?.name}
                </span>
            </h1>

            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                {result.metatype?.description}
            </p>
        </section>
    );
}
