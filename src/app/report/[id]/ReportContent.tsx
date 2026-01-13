'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
    AssessmentResult,
    QuadrantAssessment,
    QuadrantLabels,
    LevelLabels,
    PhaseLabels,
    LifestyleArchetypeLabels,
    Quadrant,
} from '@/lib/types';
import RadarChartComponent from '@/components/report/RadarChart';

interface ReportContentProps {
    assessment: {
        id: string;
        result: AssessmentResult;
        created_at: string;
    };
}

const QuadrantColors: Record<Quadrant, string> = {
    Mind: '#8b5cf6',
    Body: '#10b981',
    Spirit: '#f59e0b',
    Vocation: '#3b82f6',
};

export default function ReportContent({ assessment }: ReportContentProps) {
    const reportRef = useRef<HTMLDivElement>(null);
    const result = (assessment.result || {}) as Partial<AssessmentResult>;
    const quadrants = Array.isArray(result.quadrants) ? result.quadrants : [];

    const handleExportPDF = async () => {
        if (typeof window === 'undefined') return;

        const html2pdf = (await import('html2pdf.js')).default;
        const element = reportRef.current;

        if (!element) return;

        const opt = {
            margin: 10,
            filename: `Human3.0_评估报告_${new Date().toLocaleDateString('zh-CN')}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 800,
                width: 800,
                // 防止 oklch/oklab 颜色解析错误
                onclone: (clonedDoc: Document) => {
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        * { 
                            -webkit-print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                        /* 强制移除可能导致 html2canvas 崩溃或显示不正常的现代 CSS 特性 */
                        .blur-3xl, .blur-2xl { filter: none !important; }
                        .glass { 
                            backdrop-filter: none !important; 
                            -webkit-backdrop-filter: none !important; 
                            background: rgba(30, 30, 35, 0.8) !important; 
                        }
                        /* 修复渐变文字在 PDF 中不显示/崩溃的问题，导出时改为单一的主色 */
                        .gradient-text { 
                            background: none !important; 
                            -webkit-background-clip: unset !important;
                            background-clip: unset !important;
                            -webkit-text-fill-color: #7c3aed !important; 
                            color: #7c3aed !important; 
                        }
                        .gradient-bg {
                            background: #6d28d9 !important;
                        }
                    `;
                    clonedDoc.head.appendChild(style);
                }
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="min-h-screen pb-12">
            {/* 背景装饰 - 导出 PDF 时忽略这些可能包含复杂 CSS 滤镜和颜色的元素 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" data-html2canvas-ignore="true">
                <div
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
                    style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                />
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                />
            </div>

            {/* 顶部导航 */}
            <header className="relative z-10 px-4 py-3 border-b border-[var(--border)]">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center font-bold text-white text-sm">
                            H3
                        </div>
                        <span className="font-semibold hidden sm:inline">评估报告</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/assess"
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            新评估
                        </Link>
                        <button
                            onClick={handleExportPDF}
                            className="btn-secondary text-sm py-2 px-4"
                        >
                            导出 PDF
                        </button>
                    </div>
                </div>
            </header>

            {/* 报告内容 */}
            <main ref={reportRef} className="relative z-10 max-w-4xl mx-auto px-4 py-8">
                {/* 元类型头部 */}
                <section className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-[var(--text-secondary)] mb-6">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-green)' }} />
                        评估完成于 {new Date(assessment.created_at).toLocaleDateString('zh-CN')}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        你的元类型：
                        <span className="gradient-text block mt-2">{result.metatype?.name}</span>
                    </h1>

                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        {result.metatype?.description}
                    </p>
                </section>

                {/* 生活方式原型 */}
                {result.lifestyleArchetype && (
                    <section className="glass p-6 rounded-2xl mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
                            >
                                🎯
                            </span>
                            生活方式原型
                        </h2>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium gradient-text mb-2">
                                    {result.lifestyleArchetype.type && LifestyleArchetypeLabels[result.lifestyleArchetype.type]}
                                </h3>
                                <p className="text-[var(--text-secondary)]">
                                    {result.lifestyleArchetype.description}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* 雷达图 */}
                <section className="glass p-6 rounded-2xl mb-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                        >
                            📊
                        </span>
                        四象限发展概览
                    </h2>
                    <div className="flex justify-center w-full min-h-[320px]">
                        <RadarChartComponent quadrants={quadrants} />
                    </div>
                </section>

                {/* 象限详情 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                        >
                            🔍
                        </span>
                        象限详细分析
                    </h2>

                    <div className="grid gap-4">
                        {quadrants.map((quadrant: QuadrantAssessment) => (
                            <div
                                key={quadrant.quadrant}
                                className="card"
                                style={{ borderLeftColor: QuadrantColors[quadrant.quadrant], borderLeftWidth: '4px' }}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {QuadrantLabels[quadrant.quadrant]} - {quadrant.archetype}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-xs px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                                                {LevelLabels[quadrant.level]}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                                                {PhaseLabels[quadrant.phase]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {(['Knowledge', 'Experience', 'Skill'] as const).map((trait) => (
                                            <div key={trait} className="text-center">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium"
                                                    style={{
                                                        backgroundColor: quadrant.traits[trait] === 'High'
                                                            ? 'rgba(16, 185, 129, 0.2)'
                                                            : quadrant.traits[trait] === 'Medium'
                                                                ? 'rgba(234, 179, 8, 0.2)'
                                                                : 'rgba(239, 68, 68, 0.2)',
                                                        color: quadrant.traits[trait] === 'High'
                                                            ? '#4ade80'
                                                            : quadrant.traits[trait] === 'Medium'
                                                                ? '#facc15'
                                                                : '#f87171'
                                                    }}
                                                >
                                                    {trait[0]}
                                                </div>
                                                <span className="text-xs text-[var(--text-muted)] mt-1">
                                                    {trait === 'Knowledge' ? '知识' : trait === 'Experience' ? '经验' : '技能'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">优势</h4>
                                        <ul className="space-y-1">
                                            {quadrant.strengths.map((strength, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2">
                                                    <span className="mt-0.5" style={{ color: '#4ade80' }}>✓</span>
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">差距</h4>
                                        <ul className="space-y-1">
                                            {quadrant.gaps.map((gap, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2">
                                                    <span className="mt-0.5" style={{ color: '#fbbf24' }}>!</span>
                                                    {gap}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <p className="text-sm text-[var(--text-secondary)] mt-4 pt-4 border-t border-[var(--border)]">
                                    <strong className="text-[var(--text-primary)]">生活影响：</strong>
                                    {quadrant.lifestyleImpact}
                                </p>

                                {quadrant.falseTransformationAlert && (
                                    <div
                                        className="mt-4 p-3 rounded-lg border text-sm"
                                        style={{
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            borderColor: 'rgba(239, 68, 68, 0.2)'
                                        }}
                                    >
                                        <strong style={{ color: '#f87171' }}>⚠ 虚假转变警告：</strong>
                                        <span style={{ color: '#fca5a5' }}>{quadrant.falseTransformationAlert}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 跨象限动态 */}
                {result.crossQuadrantDynamics && (
                    <section className="glass p-6 rounded-2xl mb-8">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
                            >
                                🔗
                            </span>
                            跨象限动态
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-[var(--surface)]">
                                <h4 className="text-sm font-medium mb-2" style={{ color: '#f87171' }}>主要阻塞</h4>
                                <p className="text-sm">{result.crossQuadrantDynamics.primaryBlock}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--surface)]">
                                <h4 className="text-sm font-medium mb-2" style={{ color: '#4ade80' }}>解锁机会</h4>
                                <p className="text-sm">{result.crossQuadrantDynamics.unlockOpportunity}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--surface)]">
                                <h4 className="text-sm font-medium mb-2" style={{ color: '#60a5fa' }}>隐藏模式</h4>
                                <p className="text-sm">{result.crossQuadrantDynamics.hiddenPattern}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--surface)]">
                                <h4 className="text-sm font-medium mb-2" style={{ color: '#fbbf24' }}>级联警告</h4>
                                <p className="text-sm">{result.crossQuadrantDynamics.cascadeWarning}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* 核心问题 */}
                <section className="glass p-6 rounded-2xl mb-8 border-2 border-[var(--gradient-start)]">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                            🎯
                        </span>
                        你的核心问题
                    </h2>
                    <p className="text-lg leading-relaxed">{result.coreProblem}</p>
                </section>

                {/* 转变策略 */}
                {result.strategies && (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                            >
                                🚀
                            </span>
                            转变策略
                        </h2>

                        <div className="space-y-4">
                            {/* 30 Days */}
                            <div className="card">
                                <h3 className="text-lg font-semibold gradient-text mb-4">
                                    {result.strategies.thirtyDays.title}
                                </h3>
                                {result.strategies.thirtyDays.coreProblem && (
                                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                                        <strong>核心问题：</strong>{result.strategies.thirtyDays.coreProblem}
                                    </p>
                                )}
                                <ul className="space-y-2 mb-4">
                                    {result.strategies.thirtyDays.practices.map((practice, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <span className="text-[var(--gradient-start)]">•</span>
                                            {practice}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    <strong>每周挑战：</strong>{result.strategies.thirtyDays.challenge}
                                </p>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">
                                    <strong>成功指标：</strong>{result.strategies.thirtyDays.milestone}
                                </p>
                            </div>

                            {/* 90 Days */}
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4" style={{ color: '#a78bfa' }}>
                                    {result.strategies.ninetyDays.title}
                                </h3>
                                <ul className="space-y-2 mb-4">
                                    {result.strategies.ninetyDays.practices.map((practice, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <span style={{ color: '#a78bfa' }}>•</span>
                                            {practice}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    <strong>里程碑：</strong>{result.strategies.ninetyDays.milestone}
                                </p>
                            </div>

                            {/* 6-12 Months */}
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4" style={{ color: '#fbbf24' }}>
                                    {result.strategies.sixToTwelveMonths.title}
                                </h3>
                                <ul className="space-y-2 mb-4">
                                    {result.strategies.sixToTwelveMonths.practices.map((practice, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <span style={{ color: '#fbbf24' }}>•</span>
                                            {practice}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    <strong>目标：</strong>{result.strategies.sixToTwelveMonths.milestone}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Glitch 评估 */}
                <section className="glass p-6 rounded-2xl mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                        >
                            ⚡
                        </span>
                        Glitch 评估
                    </h2>
                    <p className="text-[var(--text-secondary)] whitespace-pre-line">
                        {result.glitchAssessment}
                    </p>
                </section>

                {/* 关键警告 */}
                {result.criticalWarnings && result.criticalWarnings.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                                ⚠️
                            </span>
                            关键警告
                        </h2>
                        <div className="space-y-3">
                            {result.criticalWarnings.map((warning, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-xl border"
                                    style={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        borderColor: 'rgba(239, 68, 68, 0.2)'
                                    }}
                                >
                                    <p className="text-sm" style={{ color: '#fca5a5' }}>{warning}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 立即行动 */}
                <section
                    className="glass p-6 rounded-2xl mb-8 border-2"
                    style={{ borderColor: '#10b981' }}
                >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                        >
                            ▶️
                        </span>
                        你的下一步行动
                    </h2>
                    <p className="text-lg">{result.immediateNextAction}</p>
                </section>

                {/* 真相 */}
                <section className="glass p-6 rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                        >
                            💡
                        </span>
                        关于你的真相
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                        {result.truthAboutSituation}
                    </p>
                </section>

                {/* 类似元类型 */}
                {result.comparableMetatypes && result.comparableMetatypes.length > 0 && (
                    <section className="mt-8 text-center">
                        <p className="text-sm text-[var(--text-muted)]">
                            相似元类型：{result.comparableMetatypes.join(' • ')}
                        </p>
                    </section>
                )}
            </main>
        </div>
    );
}
