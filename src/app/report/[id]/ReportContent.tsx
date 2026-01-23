'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
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

    // 辅助函数：将任意颜色格式转换为 RGB
    const convertColorToRGB = (color: string): string | null => {
        if (!color || color === 'transparent' || color === 'inherit' || color === 'initial' || color === 'currentcolor') {
            return null;
        }

        // 如果已经确定是有效的标准格式，直接返回
        if (color.startsWith('rgb(') || color.startsWith('rgba(') || (color.startsWith('#') && (color.length === 4 || color.length === 7 || color.length === 5 || color.length === 9))) {
            return color;
        }

        // 只有包含现代颜色函数或 CSS 变量时才尝试处理
        if (color.includes('lab') || color.includes('lch') || color.includes('oklab') || color.includes('oklch')) {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, 1, 1);
                    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
                    return a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                }
            } catch (e) {
                console.warn('Color conversion failed:', color, e);
                return '#666666'; // 默认灰色
            }
        }

        return null;
    };

    const handleExportPDF = async () => {
        if (typeof window === 'undefined') return;

        const html2pdf = (await import('html2pdf.js')).default;
        const element = reportRef.current;

        if (!element) return;

        // 保存原始样式以便稍后恢复
        const originalStyles: Map<Element, string> = new Map();
        const originalAttrs: Map<Element, { name: string, value: string }[]> = new Map();

        // 递归转换颜色（在原始文档上运行，确保克隆时已经转换）
        const convertColors = (el: Element) => {
            if (el instanceof HTMLElement || el instanceof SVGElement) {
                // 保存原始 style
                originalStyles.set(el, el.getAttribute('style') || '');

                const style = window.getComputedStyle(el);
                const props = [
                    'color', 'background-color', 'border-color', 'fill', 'stroke',
                    'stop-color', 'outline-color', 'flood-color', 'lighting-color',
                    'text-decoration-color'
                ];

                props.forEach(prop => {
                    const val = style.getPropertyValue(prop);
                    if (val && (val.includes('lab') || val.includes('lch'))) {
                        const rgb = convertColorToRGB(val);
                        if (rgb) {
                            (el as HTMLElement).style.setProperty(prop, rgb, 'important');
                        }
                    }
                });

                // 处理 SVG 特有属性
                if (el instanceof SVGElement) {
                    const attrsToConvert = ['fill', 'stroke', 'stop-color'];
                    const savedAttrs: { name: string, value: string }[] = [];
                    attrsToConvert.forEach(attr => {
                        const val = el.getAttribute(attr);
                        if (val) {
                            savedAttrs.push({ name: attr, value: val });
                            if (val.includes('lab') || val.includes('lch')) {
                                const rgb = convertColorToRGB(val);
                                if (rgb) el.setAttribute(attr, rgb);
                            }
                        }
                    });
                    if (savedAttrs.length > 0) originalAttrs.set(el, savedAttrs);
                }
            }
            Array.from(el.children).forEach(child => convertColors(child));
        };

        // 恢复原始状态
        const restoreAll = () => {
            originalStyles.forEach((style, el) => {
                if (style) el.setAttribute('style', style);
                else el.removeAttribute('style');
            });
            originalAttrs.forEach((attrs, el) => {
                attrs.forEach(attr => el.setAttribute(attr.name, attr.value));
            });
        };

        // 导出前转换
        convertColors(element);

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
                onclone: (clonedDoc: Document) => {
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                        .blur-3xl, .blur-2xl, .blur-xl { filter: none !important; }
                        .glass { 
                            backdrop-filter: none !important; 
                            -webkit-backdrop-filter: none !important; 
                            background: rgba(255, 255, 255, 0.9) !important; 
                        }
                        .recharts-responsive-container { width: 400px !important; height: 320px !important; }
                        :root {
                            --bg-primary: #FAFAFA !important;
                            --bg-secondary: #FFFFFF !important;
                            --text-primary: #1A1A1A !important;
                            --text-secondary: #666666 !important;
                            --text-tertiary: #999999 !important;
                        }
                    `;
                    clonedDoc.head.appendChild(style);
                }
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            await html2pdf().set(opt).from(element).save();
        } catch (err) {
            console.error('PDF Export Error:', err);
        } finally {
            restoreAll();
        }
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
                            href={`/assess?id=${assessment.id}`}
                            className="bg-[var(--accent-subtle)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white px-4 py-2 rounded-full transition-all flex items-center gap-2 group shadow-sm hover:shadow-md text-sm font-semibold"
                        >
                            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {language === 'zh' ? '继续聊天' : 'Continue Chatting'}
                        </Link>
                        <button
                            onClick={handleExportPDF}
                            className="btn-secondary text-sm py-2 px-4 shadow-sm hover:shadow transition-all bg-white/80 backdrop-blur-sm border border-[var(--border-subtle)]"
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
