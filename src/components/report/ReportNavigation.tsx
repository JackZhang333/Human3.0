'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import {
    LayoutGrid,
    User,
    BarChart3,
    GitBranch,
    AlertCircle,
    Compass,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';

interface NavItem {
    id: string;
    labelZh: string;
    labelEn: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { id: 'overview', labelZh: '概览', labelEn: 'Overview', icon: LayoutGrid },
    { id: 'archetype', labelZh: '原型', labelEn: 'Archetype', icon: User },
    { id: 'analysis', labelZh: '分析', labelEn: 'Analysis', icon: BarChart3 },
    { id: 'dynamics', labelZh: '动态', labelEn: 'Dynamics', icon: GitBranch },
    { id: 'problem', labelZh: '核心问题', labelEn: 'Core Problem', icon: AlertCircle },
    { id: 'strategies', labelZh: '策略', labelEn: 'Strategies', icon: Compass },
    { id: 'warnings', labelZh: '警告', labelEn: 'Warnings', icon: AlertTriangle },
    { id: 'next-steps', labelZh: '下一步', labelEn: 'Next Steps', icon: ArrowRight },
];

interface ReportNavigationProps {
    activeSection: string;
}

export function ReportNavigation({ activeSection }: ReportNavigationProps) {
    const { language } = useLanguage();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1"
            data-html2canvas-ignore="true"
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`
                            group relative flex items-center gap-3 px-3 py-2 rounded-lg
                            transition-all duration-200 ease-out
                            ${isActive
                                ? 'bg-[var(--text-primary)] text-white shadow-lg'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                            }
                        `}
                    >
                        <Icon className="w-4 h-4" />
                        <span className={`
                            text-sm font-medium whitespace-nowrap
                            transition-all duration-200
                            ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden'}
                        `}>
                            {language === 'zh' ? item.labelZh : item.labelEn}
                        </span>

                        {/* Active indicator dot */}
                        {isActive && (
                            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
