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
        <header className="relative z-10 px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                {/* Left: Logo + Title + Language Switcher */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Human 3.0" className="h-8 w-auto" />
                        {title && (
                            <span className="font-semibold hidden sm:inline">{title}</span>
                        )}
                    </Link>
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
