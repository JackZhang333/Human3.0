'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/PageHeader';

// Import new modular components
import ReportHeader from '@/components/report/ReportHeader';
import LifestyleArchetype from '@/components/report/LifestyleArchetype';
import RadarChartSection from '@/components/report/RadarChartSection';
import QuadrantAnalysis from '@/components/report/QuadrantAnalysis';
import CrossQuadrantDynamics from '@/components/report/CrossQuadrantDynamics';
import CoreProblem from '@/components/report/CoreProblem';
import TransformationStrategies from '@/components/report/TransformationStrategies';
import GlitchAndWarnings from '@/components/report/GlitchAndWarnings';
import NextSteps from '@/components/report/NextSteps';

interface ReportContentProps {
    assessment: {
        id: string;
        result: AssessmentResult;
        created_at: string;
    };
}

export default function ReportContent({ assessment }: ReportContentProps) {
    const { t, language } = useLanguage();
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
            filename: `Human3.0_${language === 'zh' ? '评估报告' : 'Report'}_${new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}.pdf`,
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
                        .blur-3xl, .blur-2xl, .blur-xl { filter: none !important; }
                        .glass { 
                            backdrop-filter: none !important; 
                            -webkit-backdrop-filter: none !important; 
                            background: rgb(255, 255, 255) !important; 
                            box-shadow: none !important;
                            border: 1px solid #e5e5e5 !important;
                        }
                        /* For dark mode compatibility if exported */
                        @media (prefers-color-scheme: dark) {
                             .glass { background: #1a1a1a !important; border-color: #333 !important; }
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
        <div className="min-h-screen pb-24 bg-[var(--bg-primary)]">
            {/* 背景装饰 - 导出 PDF 时忽略 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" data-html2canvas-ignore="true">
                <div
                    className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-50 mix-blend-multiply"
                    style={{ backgroundColor: 'var(--accent-subtle)' }}
                />
                <div
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-50 mix-blend-multiply"
                    style={{ backgroundColor: 'rgb(219 234 254)' }} /* blue-100 */
                />
            </div>

            {/* 顶部导航 */}
            <PageHeader
                title={t('report.title')}
                actions={
                    <>
                        <Link
                            href="/assess"
                            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            {t('nav.startAssessment')}
                        </Link>
                        <button
                            onClick={handleExportPDF}
                            className="btn-secondary text-sm py-2 px-4 shadow-sm hover:shadow transition-all bg-white/80 backdrop-blur-sm"
                        >
                            {language === 'zh' ? '导出 PDF' : 'Export PDF'}
                        </button>
                    </>
                }
            />

            {/* 报告内容 */}
            <main ref={reportRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8">

                <ReportHeader assessment={assessment} result={result} />

                {result.lifestyleArchetype && (
                    <LifestyleArchetype result={result} />
                )}

                <RadarChartSection quadrants={quadrants} />

                <QuadrantAnalysis quadrants={quadrants} />

                <CrossQuadrantDynamics result={result} />

                <CoreProblem result={result} />

                <TransformationStrategies result={result} />

                <GlitchAndWarnings result={result} />

                <NextSteps result={result} />

                {/* PDF Footer Watermark */}
                <div className="text-center mt-16 pt-8 border-t border-[var(--border-subtle)]">
                    <p className="text-sm text-[var(--text-tertiary)] font-medium">
                        Human 3.0 Operating System
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        Metatype Assessment Report
                    </p>
                </div>

            </main>
        </div>
    );
}
