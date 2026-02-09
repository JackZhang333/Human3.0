'use client';

import { AssessmentResult, LifestyleArchetypeLabels, LifestyleArchetypeLabelsEn } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

interface LifestyleArchetypeProps {
    result: Partial<AssessmentResult>;
}

export default function LifestyleArchetype({ result }: LifestyleArchetypeProps) {
    const { language } = useLanguage();

    if (!result.lifestyleArchetype) return null;

    return (
        <section className="mb-12">
            <div className="card relative overflow-hidden lg:p-10">
                {/* Subtle background decoration */}
                <div
                    className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--quadrant-spirit)]/5 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"
                />

                <div className="relative z-10">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--quadrant-spirit)]/20 to-[var(--quadrant-spirit)]/5 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[var(--quadrant-spirit)]" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                                {language === 'zh' ? '生活方式' : 'Lifestyle'}
                            </p>
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                {language === 'zh' ? '生活方式原型' : 'Lifestyle Archetype'}
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 max-w-2xl">
                        <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
                            {result.lifestyleArchetype.type && (
                                language === 'zh'
                                    ? LifestyleArchetypeLabels[result.lifestyleArchetype.type]
                                    : LifestyleArchetypeLabelsEn[result.lifestyleArchetype.type]
                            )}
                        </h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                            {result.lifestyleArchetype.description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
