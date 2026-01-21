'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/contexts/ToastContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </LanguageProvider>
    );
}
