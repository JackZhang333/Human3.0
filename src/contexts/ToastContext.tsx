'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextValue {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const showToast = useCallback(
        (message: string, type: ToastType = 'info', duration: number = 4000) => {
            const options = {
                duration: duration,
            };

            switch (type) {
                case 'success':
                    toast.success(message, options);
                    break;
                case 'error':
                    toast.error(message, options);
                    break;
                case 'warning':
                    toast.warning(message, options);
                    break;
                default:
                    toast.info(message, options);
                    break;
            }
        },
        []
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toaster
                position="top-center"
                expand={false}
                richColors
                closeButton
                toastOptions={{
                    style: {
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        backdropFilter: 'blur(8px)',
                    },
                }}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
