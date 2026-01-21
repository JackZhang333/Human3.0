'use client';

import { QuadrantAssessment } from '@/lib/types';
import RadarChartComponent from './RadarChart';
import { useLanguage } from '@/contexts/LanguageContext';
import { Activity } from 'lucide-react';

interface RadarChartSectionProps {
    quadrants: QuadrantAssessment[];
}

export default function RadarChartSection({ quadrants }: RadarChartSectionProps) {
    const { language } = useLanguage();

    return (
        <section className="card mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                >
                    <Activity className="w-5 h-5" />
                </span>
                {language === 'zh' ? '四象限发展概览' : '4-Quadrant Overview'}
            </h2>
            <div className="flex justify-center w-full min-h-[320px] py-4">
                <RadarChartComponent quadrants={quadrants} />
            </div>
        </section>
    );
}
