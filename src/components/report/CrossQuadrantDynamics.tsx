'use client';

import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layers } from 'lucide-react';

interface CrossQuadrantDynamicsProps {
    result: Partial<AssessmentResult>;
}

export default function CrossQuadrantDynamics({ result }: CrossQuadrantDynamicsProps) {
    const { language } = useLanguage();

    if (!result.crossQuadrantDynamics) return null;

    return (
        <section className="card mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
                >
                    <Layers className="w-5 h-5" />
                </span>
                {language === 'zh' ? '跨象限动态' : 'Cross-Quadrant Dynamics'}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-red-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {language === 'zh' ? '主要阻塞' : 'Primary Block'}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {result.crossQuadrantDynamics.primaryBlock}
                    </p>
                </div>
                <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {language === 'zh' ? '解锁机会' : 'Unlock Opportunity'}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {result.crossQuadrantDynamics.unlockOpportunity}
                    </p>
                </div>
                <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-blue-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {language === 'zh' ? '隐藏模式' : 'Hidden Pattern'}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {result.crossQuadrantDynamics.hiddenPattern}
                    </p>
                </div>
                <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-amber-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        {language === 'zh' ? '级联警告' : 'Cascade Warning'}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {result.crossQuadrantDynamics.cascadeWarning}
                    </p>
                </div>
            </div>
        </section>
    );
}
