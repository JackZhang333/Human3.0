'use client';

import { QuadrantAssessment } from '@/lib/types';
import RadarChartComponent from './RadarChart';
import { useLanguage } from '@/contexts/LanguageContext';
import { Radar } from 'lucide-react';

interface RadarChartSectionProps {
    quadrants: QuadrantAssessment[];
}

export default function RadarChartSection({ quadrants }: RadarChartSectionProps) {
    const { language } = useLanguage();

    return (
        <section className="mb-12">
            <div className="card lg:p-10">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--quadrant-mind)]/20 to-[var(--quadrant-mind)]/5 flex items-center justify-center">
                        <Radar className="w-5 h-5 text-[var(--quadrant-mind)]" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                            {language === 'zh' ? '可视化' : 'Visualization'}
                        </p>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                            {language === 'zh' ? '四象限发展概览' : '4-Quadrant Overview'}
                        </h2>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="flex justify-center w-full min-h-[400px] py-8 bg-gradient-to-b from-[var(--bg-subtle)]/50 to-transparent rounded-xl">
                    <RadarChartComponent quadrants={quadrants} />
                </div>

            </div>
        </section>
    );
}
