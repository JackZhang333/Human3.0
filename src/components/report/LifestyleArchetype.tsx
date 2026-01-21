'use client';

import { AssessmentResult, LifestyleArchetypeLabels, LifestyleArchetypeLabelsEn } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target } from 'lucide-react';

interface LifestyleArchetypeProps {
    result: Partial<AssessmentResult>;
}

export default function LifestyleArchetype({ result }: LifestyleArchetypeProps) {
    const { language } = useLanguage();

    if (!result.lifestyleArchetype) return null;

    return (
        <section className="card mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                >
                    <Target className="w-5 h-5" />
                </span>
                {language === 'zh' ? '生活方式原型' : 'Lifestyle Archetype'}
            </h2>
            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2 text-[var(--text-primary)]">
                        {result.lifestyleArchetype.type && (
                            language === 'zh'
                                ? LifestyleArchetypeLabels[result.lifestyleArchetype.type]
                                : LifestyleArchetypeLabelsEn[result.lifestyleArchetype.type]
                        )}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        {result.lifestyleArchetype.description}
                    </p>
                </div>
            </div>
        </section>
    );
}
