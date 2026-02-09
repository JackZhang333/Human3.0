'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface PageHeaderProps {
    title?: string; // Optional page title, if not provided only logo is shown
    actions?: React.ReactNode; // Optional action buttons on the right
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
    const { t } = useLanguage();

    return (
        <header className="px-4 sm:px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--glass-bg)] backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                {/* Left: Logo + Title + Language Switcher */}
                <div className="flex items-center gap-3 sm:gap-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[var(--accent-primary)]/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <img src="/logo.png" alt="Human 3.0" className="h-8 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        {title && (
                            <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)] hidden md:inline">
                                {title}
                            </span>
                        )}
                    </Link>
                    <div className="h-5 w-px bg-[var(--border-subtle)] hidden sm:block" />
                    <LanguageSwitcher />
                </div>

                {/* Right: Action Buttons */}
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
}
