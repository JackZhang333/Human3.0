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
    Mind: '#8b5cf6',
    Body: '#10b981',
    Spirit: '#f59e0b',
    Vocation: '#3b82f6',
};

export default function RadarChartComponent({ quadrants }: RadarChartComponentProps) {
    const { language } = useLanguage();

    // Transform data for chart
    const data = quadrants.map((q) => ({
        quadrant: language === 'zh' ? QuadrantLabels[q.quadrant] : QuadrantLabelsEn[q.quadrant],
        level: q.levelNumber + (q.phaseNumber - 1) * 0.33,
        fullMark: 3.99,
        color: QuadrantColors[q.quadrant],
        originalQuadrant: q.quadrant // Keep original key for colors/logic if needed
    }));

    return (
        <div className="w-full max-w-md h-80" style={{ minWidth: '320px', minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid
                        stroke="rgba(255,255,255,0.1)"
                        gridType="polygon"
                    />
                    <PolarAngleAxis
                        dataKey="quadrant"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 4]}
                        tickCount={5}
                        tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                        axisLine={false}
                    />
                    <Radar
                        name={language === 'zh' ? "发展水平" : "Development Level"}
                        dataKey="level"
                        stroke="url(#colorGradient)"
                        fill="url(#colorGradient)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const item = payload[0].payload;
                                const level = Math.floor(item.level);
                                const phase = Math.round((item.level - level) * 3) + 1;
                                return (
                                    <div className="glass px-3 py-2 rounded-lg">
                                        <p className="font-medium">{item.quadrant}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">
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
                    <defs>
                        <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="50%" stopColor="#f093fb" />
                            <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                    </defs>
                </RadarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {quadrants.map((q) => (
                    <div key={q.quadrant} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
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
