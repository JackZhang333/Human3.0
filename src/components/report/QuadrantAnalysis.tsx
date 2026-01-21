'use client';

import {
    QuadrantAssessment,
    QuadrantLabels,
    QuadrantLabelsEn,
    LevelLabels,
    LevelLabelsEn,
    PhaseLabels,
    PhaseLabelsEn,
    Quadrant,
    Trait
} from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScanSearch } from 'lucide-react';

interface QuadrantAnalysisProps {
    quadrants: QuadrantAssessment[];
}

const QuadrantColors: Record<Quadrant, string> = {
    Mind: 'var(--quadrant-mind)',
    Body: 'var(--quadrant-body)',
    Spirit: 'var(--quadrant-spirit)',
    Vocation: 'var(--quadrant-vocation)',
};

const TraitLabelsDisplay: Record<Trait, { zh: string; en: string }> = {
    Knowledge: { zh: '知识', en: 'Knw' },
    Experience: { zh: '经验', en: 'Exp' },
    Skill: { zh: '技能', en: 'Skl' },
};

export default function QuadrantAnalysis({ quadrants }: QuadrantAnalysisProps) {
    const { language } = useLanguage();

    return (
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                >
                    <ScanSearch className="w-5 h-5" />
                </span>
                {language === 'zh' ? '象限详细分析' : 'Detailed Quadrant Analysis'}
            </h2>

            <div className="grid gap-4">
                {quadrants.map((quadrant: QuadrantAssessment) => (
                    <div
                        key={quadrant.quadrant}
                        className="card"
                        style={{
                            borderLeft: `4px solid ${QuadrantColors[quadrant.quadrant]}`
                        }}
                    >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    {language === 'zh' ? QuadrantLabels[quadrant.quadrant] : QuadrantLabelsEn[quadrant.quadrant]}
                                    <span className="text-[var(--text-tertiary)] font-normal text-base">- {quadrant.archetype}</span>
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                                        {language === 'zh' ? LevelLabels[quadrant.level] : LevelLabelsEn[quadrant.level]}
                                    </span>
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                                        {language === 'zh' ? PhaseLabels[quadrant.phase] : PhaseLabelsEn[quadrant.phase]}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {(['Knowledge', 'Experience', 'Skill'] as const).map((trait) => (
                                    <div key={trait} className="text-center group">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-105"
                                            style={{
                                                backgroundColor: quadrant.traits?.[trait] === 'High'
                                                    ? 'rgba(16, 185, 129, 0.1)'
                                                    : quadrant.traits?.[trait] === 'Medium'
                                                        ? 'rgba(234, 179, 8, 0.1)'
                                                        : 'rgba(239, 68, 68, 0.1)',
                                                color: quadrant.traits?.[trait] === 'High'
                                                    ? 'var(--success)'
                                                    : quadrant.traits?.[trait] === 'Medium'
                                                        ? 'var(--warning)'
                                                        : 'var(--error)'
                                            }}
                                        >
                                            {trait[0]}
                                        </div>
                                        <span className="text-[10px] text-[var(--text-tertiary)] mt-1.5 block uppercase tracking-wider">
                                            {TraitLabelsDisplay[trait][language as 'zh' | 'en']}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pb-4">
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider text-xs">
                                    {language === 'zh' ? '优势' : 'Strengths'}
                                </h4>
                                <ul className="space-y-2">
                                    {quadrant.strengths.map((strength, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2.5">
                                            <span className="mt-1 text-[var(--success)]">✓</span>
                                            <span className="text-[var(--text-primary)] leading-relaxed">{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider text-xs">
                                    {language === 'zh' ? '差距' : 'Gaps'}
                                </h4>
                                <ul className="space-y-2">
                                    {quadrant.gaps.map((gap, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2.5">
                                            <span className="mt-1 text-[var(--warning)]">!</span>
                                            <span className="text-[var(--text-primary)] leading-relaxed">{gap}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                            <p className="text-sm">
                                <strong className="text-[var(--text-primary)] block mb-1">
                                    {language === 'zh' ? '生活影响' : 'Lifestyle Impact'}
                                </strong>
                                <span className="text-[var(--text-secondary)] leading-relaxed">{quadrant.lifestyleImpact}</span>
                            </p>
                        </div>

                        {quadrant.falseTransformationAlert && (
                            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 dark:bg-red-900/10 dark:border-red-800/30">
                                <div className="flex gap-2">
                                    <span className="text-red-500">⚠</span>
                                    <div className="text-sm">
                                        <strong className="text-red-700 dark:text-red-400 block mb-1">
                                            {language === 'zh' ? '虚假转变警告' : 'False Transformation Alert'}
                                        </strong>
                                        <span className="text-red-600/90 dark:text-red-300/90 leading-relaxed">
                                            {quadrant.falseTransformationAlert}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
