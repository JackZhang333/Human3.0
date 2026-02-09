'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { GitBranch, XCircle, Unlock, Eye, AlertOctagon } from 'lucide-react';

interface CrossQuadrantDynamicsProps {
    result: Partial<AssessmentResult>;
}

const dynamicsConfig = [
    { key: 'primaryBlock', icon: XCircle, color: 'var(--error)', labelZh: '主要阻塞', labelEn: 'Primary Block' },
    { key: 'unlockOpportunity', icon: Unlock, color: 'var(--success)', labelZh: '解锁机会', labelEn: 'Unlock Opportunity' },
    { key: 'hiddenPattern', icon: Eye, color: 'var(--quadrant-mind)', labelZh: '隐藏模式', labelEn: 'Hidden Pattern' },
    { key: 'cascadeWarning', icon: AlertOctagon, color: 'var(--warning)', labelZh: '级联警告', labelEn: 'Cascade Warning' },
] as const;

export default function CrossQuadrantDynamics({ result }: CrossQuadrantDynamicsProps) {
    const { language } = useLanguage();

    if (!result.crossQuadrantDynamics) return null;

    return (
        <section className="mb-12">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--quadrant-vocation)]/20 to-[var(--quadrant-vocation)]/5 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-[var(--quadrant-vocation)]" />
                </div>
                <div>
                    <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                        {language === 'zh' ? '系统视角' : 'System View'}
                    </p>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {language === 'zh' ? '跨象限动态' : 'Cross-Quadrant Dynamics'}
                    </h2>
                </div>
            </div>

            <div className="card lg:p-10">
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {dynamicsConfig.map((item) => {
                        const Icon = item.icon;
                        const value = result.crossQuadrantDynamics?.[item.key as keyof typeof result.crossQuadrantDynamics];

                        return (
                            <div
                                key={item.key}
                                className="p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-primary)] transition-colors group"
                            >
                                <h4 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: item.color }}>
                                    <span
                                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                                        style={{ backgroundColor: `${item.color}15` }}
                                    >
                                        <Icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                                    </span>
                                    <span>{language === 'zh' ? item.labelZh : item.labelEn}</span>
                                </h4>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-sm lg:text-base">
                                    {value}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
