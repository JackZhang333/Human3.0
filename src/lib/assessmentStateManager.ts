import { Message, Quadrant, QUADRANT_ORDER } from './types';
import { extractAssessmentReport } from './reportUtils';

export interface AssessmentState {
    currentQuadrant: Quadrant;
    completedQuadrants: Quadrant[];
    isComplete: boolean;
    isReadyToGenerate: boolean;
    reportResult: any | null;
}

export const detectAssessmentState = (messages: Message[]): AssessmentState => {
    let currentQuadrant: Quadrant = 'Mind';
    const completedQuadrants: Quadrant[] = [];
    let isComplete = false;
    let isReadyToGenerate = false;
    let reportResult: any | null = null;

    // Transition keywords for each quadrant
    const quadrantIndicators: Record<Quadrant, string[]> = {
        Mind: ['心智', 'mind', '内在现实', 'internal reality'],
        Body: ['身体', 'body', '体能', 'physical'],
        Spirit: ['精神', 'spirit', '集体心理', 'collective psychological'],
        Vocation: ['使命', 'vocation', '事业', 'collective physical']
    };

    // Progression logic
    for (const msg of messages) {
        if (msg.role !== 'assistant') continue;

        const content = msg.content.toLowerCase();

        // Check for completion first
        if (content.includes('[assessment_complete]') || content.includes('{"metatype":')) {
            isComplete = true;
            isReadyToGenerate = true; // If complete, it is also ready (or was ready)
            reportResult = extractAssessmentReport(msg.content);
            if (isComplete) {
                // If complete, all are finished
                return {
                    currentQuadrant: 'Vocation',
                    completedQuadrants: [...QUADRANT_ORDER],
                    isComplete: true,
                    isReadyToGenerate: true,
                    reportResult
                };
            }
        }

        // Check for soft completion / ready to generate signals
        // These are phrases the AI might use when it thinks it has enough info but hasn't received the command to generate JSON yet.
        const completionSignals = [
            'assessment is complete', '评估已完成',
            'concludes our interview', '访谈结束',
            'complete your profile', '生成您的档案',
            'generating your report', '生成您的报告',
            'thank you for sharing', '感谢你的分享',
            'gathering all the insights', '汇总所有洞见',
            'all quadrants covered', '所有象限',
            'ready to generate', '准备生成',
            'wrapping up', '收尾',
            'sufficient information', '信息充足',
            'full picture', '全面了解',
            'create your report', '为您创建报告',
            'comprehensive view', '全貌'
        ];

        // Only check for signals if we are already in Vocation and not yet complete
        if (currentQuadrant === 'Vocation' && !isComplete) {
            const lowerContent = content.toLowerCase();

            // 1. Keyword check
            if (completionSignals.some(signal => lowerContent.includes(signal))) {
                isReadyToGenerate = true;
            }

            // 2. Question Detection Fallback (Heuristic)
            // If the AI is replying in the Vocation phase, keeps it relatively short (likely a wrap up),
            // and DOES NOT ask a question, we assume it's waiting for a trigger or just done.
            // We exclude cases where it might be a very long explanation (e.g. > 500 chars) as it might still be teaching.
            // But usually, final wrap up is short.
            const hasQuestion = lowerContent.includes('?') || lowerContent.includes('？') || lowerContent.includes('question') || lowerContent.includes('问题');
            if (!hasQuestion && !isReadyToGenerate) {
                // Double check it's not just a short acknowledgement "I see."
                if (content.length > 20) {
                    // It said something substantial but didn't ask a question.
                    // In the context of an interview, this usually means "I'm done waiting for your input".
                    isReadyToGenerate = true;
                }
            }
        }

        // Detect transitions to next quadrants
        // We look for transition cues and update the "current" state
        // Order: Mind -> Body -> Spirit -> Vocation

        if (shouldTransitionTo('Body', content)) {
            if (!completedQuadrants.includes('Mind')) completedQuadrants.push('Mind');
            currentQuadrant = 'Body';
        }

        if (shouldTransitionTo('Spirit', content)) {
            if (!completedQuadrants.includes('Mind')) completedQuadrants.push('Mind');
            if (!completedQuadrants.includes('Body')) completedQuadrants.push('Body');
            currentQuadrant = 'Spirit';
        }

        if (shouldTransitionTo('Vocation', content)) {
            if (!completedQuadrants.includes('Mind')) completedQuadrants.push('Mind');
            if (!completedQuadrants.includes('Body')) completedQuadrants.push('Body');
            if (!completedQuadrants.includes('Spirit')) completedQuadrants.push('Spirit');
            currentQuadrant = 'Vocation';
        }
    }

    // Force isReadyToGenerate if we have really good signal for Vocation wrapping up
    // This is a backup if the specific phrase wasn't caught in the loop but we are deep in vocation.
    // However, purely relying on loop is safer to avoiding premature triggering.
    // For now, let's trust the completionSignals in the loop or the explicit isComplete.

    return {
        currentQuadrant,
        completedQuadrants,
        isComplete,
        isReadyToGenerate,
        reportResult
    };
};

const shouldTransitionTo = (quadrant: Quadrant, content: string): boolean => {
    const triggers: Record<Quadrant, string[]> = {
        Mind: [], // Starting point
        Body: ['让我们从你的身体象限开始', '让我们来看看身体象限', 'move on to your body', 'physical quadrant', '身体象限'],
        Spirit: ['让我们来看看精神象限', '精神象限', 'spirit quadrant', 'move on to your spirit'],
        Vocation: ['进入使命象限', '使命象限', 'vocation quadrant', 'move on to your vocation']
    };

    return triggers[quadrant].some(t => content.includes(t.toLowerCase()));
};
