'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, FileDown } from 'lucide-react';
import { AssessmentResult } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';

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
import { ReportNavigation } from '@/components/report/ReportNavigation';

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
    const [activeSection, setActiveSection] = useState('overview');
    const result = (assessment.result || {}) as Partial<AssessmentResult>;
    const quadrants = Array.isArray(result.quadrants) ? result.quadrants : [];

    // Track scroll position for navigation
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['overview', 'archetype', 'analysis', 'dynamics', 'problem', 'strategies', 'warnings', 'next-steps'];
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 辅助函数：将任意颜色格式转换为 RGB
    const convertColorToRGB = (color: string): string | null => {
        if (!color || color === 'transparent' || color === 'inherit' || color === 'initial' || color === 'currentcolor') {
            return null;
        }

        // 如果已经确定是有效的标准格式，直接返回
        if (color.startsWith('rgb(') || color.startsWith('rgba(') || (color.startsWith('#') && (color.length === 4 || color.length === 7 || color.length === 5 || color.length === 9))) {
            return color;
        }

        // 只有包含现代颜色函数时才尝试处理
        if (color.includes('lab') || color.includes('lch')) {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = color.trim();
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

    // 辅助函数：处理复合样式值（如 gradient），替换其中的现代颜色函数为 RGB
    const processStyleValue = (value: string): string => {
        if (!value) return value;
        if (!value.includes('lab') && !value.includes('lch')) return value;

        // 匹配 lab, lch, oklab, oklch 函数及其参数
        return value.replace(/(okl)?(ab|ch)\([^)]+\)/g, (match) => {
            const rgb = convertColorToRGB(match);
            return rgb || match;
        });
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
                    'text-decoration-color', 'background-image', 'background'
                ];

                props.forEach(prop => {
                    const val = style.getPropertyValue(prop);
                    if (val && (val.includes('lab') || val.includes('lch'))) {
                        const processed = processStyleValue(val);
                        if (processed !== val) {
                            (el as HTMLElement).style.setProperty(prop, processed, 'important');
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
                                const processed = processStyleValue(val);
                                if (processed !== val) el.setAttribute(attr, processed);
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
                            --bg-primary: #FDFCFA !important;
                            --bg-secondary: #FFFFFF !important;
                            --text-primary: #1C1917 !important;
                            --text-secondary: #57534E !important;
                            --text-tertiary: #A8A29E !important;
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
                {/* Top right warm glow */}
                <div
                    className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full opacity-[0.03]"
                    style={{
                        background: 'radial-gradient(circle, var(--quadrant-spirit) 0%, transparent 70%)',
                        filter: 'blur(80px)'
                    }}
                />
                {/* Bottom left cool glow */}
                <div
                    className="absolute -bottom-60 -left-60 w-[600px] h-[600px] rounded-full opacity-[0.03]"
                    style={{
                        background: 'radial-gradient(circle, var(--quadrant-mind) 0%, transparent 70%)',
                        filter: 'blur(80px)'
                    }}
                />
                {/* Subtle noise texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* 顶部导航 */}
            <PageHeader
                title={t('report.title')}
                actions={
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href={`/assess?id=${assessment.id}`}
                            className="btn-ghost h-9 px-3 sm:px-4 text-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {language === 'zh' ? '继续对话' : 'Continue'}
                            </span>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportPDF}
                            className="h-9 px-3 sm:px-4 rounded-md bg-white border-[var(--border-subtle)] hover:border-[var(--border-primary)] hover:bg-[var(--bg-subtle)] text-sm font-medium"
                        >
                            <FileDown className="w-4 h-4 sm:mr-1.5" />
                            <span className="hidden sm:inline">
                                {language === 'zh' ? '导出 PDF' : 'Export PDF'}
                            </span>
                        </Button>
                    </div>
                }
            />

            {/* Side Navigation */}
            <ReportNavigation activeSection={activeSection} />

            {/* 报告内容 */}
            <main ref={reportRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:pr-72 py-8 sm:py-12">

                <div id="overview" className="scroll-mt-24">
                    <ReportHeader assessment={assessment} result={result} />
                </div>

                {result.lifestyleArchetype && (
                    <div id="archetype" className="scroll-mt-24">
                        <LifestyleArchetype result={result} />
                    </div>
                )}

                <div id="analysis" className="scroll-mt-24">
                    <RadarChartSection quadrants={quadrants} />
                    <QuadrantAnalysis quadrants={quadrants} />
                </div>

                <div id="dynamics" className="scroll-mt-24">
                    <CrossQuadrantDynamics result={result} />
                </div>

                <div id="problem" className="scroll-mt-24">
                    <CoreProblem result={result} />
                </div>

                <div id="strategies" className="scroll-mt-24">
                    <TransformationStrategies result={result} />
                </div>

                <div id="warnings" className="scroll-mt-24">
                    <GlitchAndWarnings result={result} />
                </div>

                <div id="next-steps" className="scroll-mt-24">
                    <NextSteps result={result} />
                </div>

                {/* PDF Footer Watermark */}
                <div className="text-center mt-20 pt-12 border-t border-[var(--border-subtle)]">
                    <p className="text-sm text-[var(--text-tertiary)] font-medium tracking-wide">
                        Human 3.0 Operating System
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        Metatype Assessment Report
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-4">
                        {new Date(assessment.created_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
                    </p>
                </div>

            </main>
        </div>
    );
}
