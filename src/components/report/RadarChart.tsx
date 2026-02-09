'use client';

import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { QuadrantAssessment, QuadrantLabels, QuadrantLabelsEn, Quadrant } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface RadarChartComponentProps {
    quadrants: QuadrantAssessment[];
}

const QuadrantColors: Record<Quadrant, string> = {
    Mind: '#4F46E5',
    Body: '#059669',
    Spirit: '#D97706',
    Vocation: '#0891B2',
};

export default function RadarChartComponent({ quadrants }: RadarChartComponentProps) {
    const { language } = useLanguage();

    // Transform data for chart
    const data = quadrants.map((q) => ({
        quadrant: language === 'zh' ? QuadrantLabels[q.quadrant] : QuadrantLabelsEn[q.quadrant],
        level: q.levelNumber + (q.phaseNumber - 1) * 0.33,
        fullMark: 3.99,
        color: QuadrantColors[q.quadrant],
        originalQuadrant: q.quadrant
    }));

    return (
        <div className="w-full max-w-md h-80" style={{ minWidth: '320px', minHeight: '320px', width: '400px', height: '320px' }}>
            <ResponsiveContainer width={400} height={320}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                    <PolarGrid
                        stroke="var(--border-subtle)"
                        gridType="polygon"
                    />
                    <PolarAngleAxis
                        dataKey="quadrant"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 4]}
                        tickCount={5}
                        tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                        axisLine={false}
                    />
                    <Radar
                        name={language === 'zh' ? "发展水平" : "Development Level"}
                        dataKey="level"
                        stroke="var(--quadrant-mind)"
                        fill="var(--quadrant-mind)"
                        fillOpacity={0.15}
                        strokeWidth={2}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const item = payload[0].payload;
                                const level = Math.floor(item.level);
                                const phase = Math.round((item.level - level) * 3) + 1;
                                return (
                                    <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-[var(--border-subtle)] shadow-lg">
                                        <p className="font-medium text-[var(--text-primary)]">{item.quadrant}</p>
                                        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                                            {language === 'zh'
                                                ? `等级 ${level}.0 · 阶段 ${phase}`
                                                : `Level ${level}.0 · Phase ${phase}`
                                            }
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {quadrants.map((q) => (
                    <div key={q.quadrant} className="flex items-center gap-2">
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: QuadrantColors[q.quadrant] }}
                        />
                        <span className="text-xs text-[var(--text-secondary)]">
                            {language === 'zh' ? QuadrantLabels[q.quadrant] : QuadrantLabelsEn[q.quadrant]}: {q.levelNumber}.{q.phaseNumber}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
