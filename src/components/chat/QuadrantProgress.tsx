import { Quadrant, QuadrantLabels } from '@/lib/types';
import { QUADRANT_ORDER } from '@/lib/prompts';

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
    return (
        <div className="flex items-center justify-between max-w-md mx-auto">
            {QUADRANT_ORDER.map((quadrant, index) => {
                const isCompleted = completedQuadrants.includes(quadrant);
                const isCurrent = currentQuadrant === quadrant;
                const isPending = !isCompleted && !isCurrent;

                return (
                    <div key={quadrant} className="flex items-center">
                        {/* Step */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`progress-step ${isCompleted
                                        ? 'progress-step-completed'
                                        : isCurrent
                                            ? 'progress-step-active'
                                            : 'progress-step-pending'
                                    }`}
                                style={
                                    isCompleted
                                        ? { backgroundColor: QuadrantColors[quadrant] }
                                        : undefined
                                }
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    QuadrantIcons[quadrant]
                                )}
                            </div>
                            <span
                                className={`text-xs mt-1 ${isCurrent
                                        ? 'text-[var(--text-primary)] font-medium'
                                        : isPending
                                            ? 'text-[var(--text-muted)]'
                                            : 'text-[var(--text-secondary)]'
                                    }`}
                            >
                                {QuadrantLabels[quadrant]}
                            </span>
                        </div>

                        {/* Connector */}
                        {index < QUADRANT_ORDER.length - 1 && (
                            <div
                                className={`w-8 md:w-12 h-0.5 mx-2 ${isCompleted ? 'bg-[var(--gradient-start)]' : 'bg-[var(--border)]'
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
