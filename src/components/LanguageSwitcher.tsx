'use client';

import { useLanguage } from '@/contexts/LanguageContext';

import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-full bg-white/50 backdrop-blur-sm border border-[var(--border-subtle)] hover:bg-white hover:text-[var(--accent-primary)] transition-all font-bold"
            aria-label="Switch language"
        >
            <Languages className="w-4 h-4" />
            <span className="tracking-tight">{language === 'zh' ? '中文' : 'ENG'}</span>
        </Button>
    );
}
