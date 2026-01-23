'use client';

import { Quadrant, QuadrantLabels, QUADRANT_ORDER } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuadrantProgressProps {
    currentQuadrant: Quadrant;
    completedQuadrants: Quadrant[];
}

const QuadrantIcons: Record<Quadrant, React.ReactNode> = {
    Mind: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    ),
    Body: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    Spirit: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Vocation: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
};

const QuadrantColors: Record<Quadrant, string> = {
    Mind: 'var(--quadrant-mind)',
    Body: 'var(--quadrant-body)',
    Spirit: 'var(--quadrant-spirit)',
    Vocation: 'var(--quadrant-vocation)',
};

export default function QuadrantProgress({
    currentQuadrant,
    completedQuadrants,
}: QuadrantProgressProps) {
    const { language } = useLanguage();

    // Bilingual quadrant labels
    const quadrantNames: Record<Quadrant, { zh: string; en: string }> = {
        Mind: { zh: '心智', en: 'Mind' },
        Body: { zh: '身体', en: 'Body' },
        Spirit: { zh: '精神', en: 'Spirit' },
        Vocation: { zh: '使命', en: 'Vocation' },
    };
    return (
        <div className="flex items-center justify-between max-w-lg mx-auto w-full px-2">
            {QUADRANT_ORDER.map((quadrant, index) => {
                const isCompleted = completedQuadrants.includes(quadrant);
                const isCurrent = currentQuadrant === quadrant;
                const isPending = !isCompleted && !isCurrent;

                return (
                    <div key={quadrant} className="flex items-center flex-1 last:flex-none">
                        {/* Step */}
                        <div className="flex flex-col items-center group">
                            <div
                                className={`progress-step transition-all duration-500 ${isCompleted
                                    ? 'shadow-lg'
                                    : isCurrent
                                        ? 'shadow-xl scale-110 ring-4 ring-white/50'
                                        : 'opacity-40 grayscale'
                                    }`}
                                style={
                                    isCompleted || isCurrent
                                        ? {
                                            backgroundColor: QuadrantColors[quadrant],
                                            color: 'white',
                                            borderColor: 'transparent'
                                        }
                                        : undefined
                                }
                            >
                                {isCompleted ? (
                                    <svg className="w-5 h-5 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <div className={isCurrent ? 'animate-pulse' : ''}>
                                        {QuadrantIcons[quadrant]}
                                    </div>
                                )}
                            </div>
                            <span
                                className={`text-[10px] uppercase font-bold tracking-tighter mt-2 transition-all duration-300 ${isCurrent
                                    ? 'text-[var(--text-primary)] translate-y-0.5'
                                    : 'text-[var(--text-tertiary)]'
                                    }`}
                            >
                                {quadrantNames[quadrant][language]}
                            </span>
                        </div>

                        {/* Connector */}
                        {index < QUADRANT_ORDER.length - 1 && (
                            <div className="flex-1 px-2 mb-6">
                                <div
                                    className={`h-0.5 w-full rounded-full transition-all duration-700 ${isCompleted
                                        ? 'bg-gradient-to-r from-[var(--quadrant-mind)] to-[var(--quadrant-body)] scale-x-100 origin-left'
                                        : 'bg-black/5'
                                        }`}
                                    style={
                                        isCompleted
                                            ? {
                                                backgroundImage: `linear-gradient(to right, ${QuadrantColors[QUADRANT_ORDER[index]]}, ${QuadrantColors[QUADRANT_ORDER[index + 1]]})`
                                            }
                                            : {}
                                    }
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
