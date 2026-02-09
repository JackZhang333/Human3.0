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
import { ScanSearch, BookOpen, History, Zap, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface QuadrantAnalysisProps {
    quadrants: QuadrantAssessment[];
}

const QuadrantColors: Record<Quadrant, string> = {
    Mind: 'var(--quadrant-mind)',
    Body: 'var(--quadrant-body)',
    Spirit: 'var(--quadrant-spirit)',
    Vocation: 'var(--quadrant-vocation)',
};

const TraitLabelsDisplay: Record<Trait, { zh: string; en: string; icon: any }> = {
    Knowledge: { zh: '知识', en: 'Knowledge', icon: BookOpen },
    Experience: { zh: '经验', en: 'Experience', icon: History },
    Skill: { zh: '技能', en: 'Skill', icon: Zap },
};

const TraitLevelLabels: Record<string, { zh: string; en: string; color: string; icon: any }> = {
    High: { zh: '充足', en: 'Ample', color: 'var(--success)', icon: CheckCircle2 },
    Medium: { zh: '一般', en: 'Average', color: 'var(--warning)', icon: AlertCircle },
    Low: { zh: '缺乏', en: 'Insufficient', color: 'var(--error)', icon: HelpCircle },
};

export default function QuadrantAnalysis({ quadrants }: QuadrantAnalysisProps) {
    const { language } = useLanguage();

    return (
        <section className="mb-12">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--quadrant-mind)]/20 to-[var(--quadrant-vocation)]/5 flex items-center justify-center">
                    <ScanSearch className="w-5 h-5 text-[var(--quadrant-mind)]" />
                </div>
                <div>
                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                        {language === 'zh' ? '深度分析' : 'Deep Analysis'}
                    </p>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {language === 'zh' ? '象限详细分析' : 'Detailed Quadrant Analysis'}
                    </h2>
                </div>
            </div>

            <div className="space-y-6">
                {quadrants.map((quadrant: QuadrantAssessment, index: number) => (
                    <div
                        key={quadrant.quadrant}
                        className="card relative overflow-hidden"
                        style={{
                            borderLeft: `3px solid ${QuadrantColors[quadrant.quadrant]}`
                        }}
                    >
                        {/* Subtle quadrant color background */}
                        <div
                            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-[0.03] pointer-events-none transform translate-x-1/4 -translate-y-1/4"
                            style={{ backgroundColor: QuadrantColors[quadrant.quadrant] }}
                        />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6 mb-8 pb-6 border-b border-[var(--border-subtle)]">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: QuadrantColors[quadrant.quadrant] }}
                                        />
                                        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                                            {language === 'zh' ? QuadrantLabels[quadrant.quadrant] : QuadrantLabelsEn[quadrant.quadrant]}
                                        </h3>
                                        <span className="text-[var(--text-tertiary)] font-normal">
                                            — {quadrant.archetype}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
                                            {language === 'zh' ? LevelLabels[quadrant.level] : LevelLabelsEn[quadrant.level]}
                                        </span>
                                        <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
                                            {language === 'zh' ? PhaseLabels[quadrant.phase] : PhaseLabelsEn[quadrant.phase]}
                                        </span>
                                    </div>
                                </div>

                                {/* Traits */}
                                <div className="flex flex-wrap lg:flex-nowrap gap-3 items-start">
                                    {(['Knowledge', 'Experience', 'Skill'] as const).map((trait) => {
                                        const rawLevel = quadrant.traits?.[trait] || 'Low';
                                        const level = (rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1).toLowerCase()) as keyof typeof TraitLevelLabels;
                                        const config = TraitLevelLabels[level] || TraitLevelLabels.Low;
                                        const traitInfo = TraitLabelsDisplay[trait];
                                        const Icon = traitInfo.icon;

                                        return (
                                            <div
                                                key={trait}
                                                className="flex items-center gap-3 bg-[var(--bg-subtle)] px-4 py-3 rounded-lg border border-[var(--border-subtle)] min-w-[130px] lg:min-w-0"
                                            >
                                                <div
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        backgroundColor: `${config.color}15`,
                                                        color: config.color
                                                    }}
                                                >
                                                    <Icon className="w-4.5 h-4.5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider">
                                                        {traitInfo[language as 'zh' | 'en']}
                                                    </span>
                                                    <span className="text-sm font-semibold" style={{ color: config.color }}>
                                                        {config[language as 'zh' | 'en']}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Strengths & Gaps */}
                            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--success)] mb-4">
                                        <div className="w-6 h-6 rounded-lg bg-[var(--success-subtle)] flex items-center justify-center">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="uppercase tracking-wider">
                                            {language === 'zh' ? '优势' : 'Strengths'}
                                        </span>
                                    </h4>
                                    <ul className="space-y-3">
                                        {quadrant.strengths.map((strength, i) => (
                                            <li key={i} className="flex items-start gap-3 group/item">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--success)]/30 group-hover/item:bg-[var(--success)]/50 transition-colors flex-shrink-0" />
                                                <span className="text-[var(--text-secondary)] leading-relaxed">{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--warning)] mb-4">
                                        <div className="w-6 h-6 rounded-lg bg-[var(--warning-subtle)] flex items-center justify-center">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="uppercase tracking-wider">
                                            {language === 'zh' ? '差距' : 'Gaps'}
                                        </span>
                                    </h4>
                                    <ul className="space-y-3">
                                        {quadrant.gaps.map((gap, i) => (
                                            <li key={i} className="flex items-start gap-3 group/item">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--warning)]/30 group-hover/item:bg-[var(--warning)]/50 transition-colors flex-shrink-0" />
                                                <span className="text-[var(--text-secondary)] leading-relaxed">{gap}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Lifestyle Impact */}
                            {quadrant.lifestyleImpact && (
                                <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
                                    <div className="flex items-start gap-4 bg-gradient-to-r from-[var(--bg-subtle)]/80 to-transparent p-5 rounded-xl border border-[var(--border-subtle)]/50">
                                        <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] shadow-sm flex-shrink-0">
                                            <HelpCircle className="w-4 h-4 text-[var(--quadrant-mind)]" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider block mb-1">
                                                {language === 'zh' ? '生活影响' : 'Lifestyle Impact'}
                                            </span>
                                            <p className="text-[var(--text-secondary)] leading-relaxed italic">
                                                "{quadrant.lifestyleImpact}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* False Transformation Alert */}
                            {quadrant.falseTransformationAlert && (
                                <div className="mt-6 p-5 rounded-xl bg-[var(--error-subtle)] border border-[var(--error)]/10">
                                    <div className="flex gap-3">
                                        <span className="text-[var(--error)] text-lg">⚠</span>
                                        <div>
                                            <strong className="text-[var(--error)] block mb-1 text-sm font-semibold">
                                                {language === 'zh' ? '虚假转变警告' : 'False Transformation Alert'}
                                            </strong>
                                            <span className="text-[var(--error)]/80 leading-relaxed text-sm">
                                                {quadrant.falseTransformationAlert}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
