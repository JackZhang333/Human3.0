export interface AssessmentReport {
    metatype: {
        name: string;
        description: string;
    };
    lifestyleArchetype: {
        type: string;
        description: string;
    };
    quadrants: Array<{
        quadrant: 'Mind' | 'Body' | 'Spirit' | 'Vocation';
        level: string;
        levelNumber: number;
        phase: string;
        phaseNumber: number;
        archetype: string;
        strengths: string[];
        gaps: string[];
        lifestyleImpact: string;
        falseTransformationAlert?: string;
        traits: {
            Knowledge: string;
            Experience: string;
            Skill: string;
        };
    }>;
    crossQuadrantDynamics: any;
    coreProblem: string;
    strategies: any;
    glitchAssessment: string;
    criticalWarnings: string[];
    comparableMetatypes?: string[];
    immediateNextAction: string;
    truthAboutSituation: string;
}

/**
 * Extracts and parses the assessment report JSON from the AI response content.
 * Robustly handles:
 * - [ASSESSMENT_COMPLETE] marker
 * - Markdown code blocks (```json ... ```)
 * - Trailing text
 * - Newlines and control characters
 * 
 * @param content The full content string from the AI
 * @returns The parsed AssessmentReport object or null if not found/incomplete
 */
export const extractAssessmentReport = (content: string): AssessmentReport | null => {
    try {
        if (!content) return null;

        // 1. Locate the marker
        const marker = '[ASSESSMENT_COMPLETE]';
        const markerIndex = content.indexOf(marker);

        // If marker is not found, we can't be sure it's ready
        if (markerIndex === -1) return null;

        // Get content after marker
        let jsonSection = content.substring(markerIndex + marker.length);

        // 2. Find the first opening brace '{'
        const startIndex = jsonSection.indexOf('{');
        if (startIndex === -1) return null;

        // 3. Robustly find the matching closing brace '}'
        // We track brace depth to handle nested objects correctly
        let depth = 0;
        let endIndex = -1;
        let inString = false;
        let escaped = false;

        // Start scanning from the first brace
        for (let i = startIndex; i < jsonSection.length; i++) {
            const char = jsonSection[i];

            if (escaped) {
                escaped = false;
                continue;
            }

            if (char === '\\') {
                escaped = true;
                continue;
            }

            if (char === '"' && !escaped) {
                inString = !inString;
                continue;
            }

            if (!inString) {
                if (char === '{') {
                    depth++;
                } else if (char === '}') {
                    depth--;
                    if (depth === 0) {
                        endIndex = i;
                        break;
                    }
                }
            }
        }

        if (endIndex === -1) {
            // JSON object is not closed yet (likely still streaming)
            return null;
        }

        // 4. Extract the potential JSON string
        let jsonString = jsonSection.substring(startIndex, endIndex + 1);

        // 5. Clean up the string
        // Remove markdown code block syntax if it was included within the braces (unlikely but possible if logic changes)
        // More commonly, the code block markers are outside. 
        // If the extraction above worked, we have the clean JSON object.
        // But we should handle newlines/tabs that valid JSON allows but our prompt tries to discourage.

        // Clean control characters that are invalid in JSON
        jsonString = jsonString.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

        // Note: Newlines (\n) depend on how they are represented. 
        // If they are literal newlines in the string, JSON.parse handles them fine.
        // If they are escaped newlines inside strings, JSON.parse handles them fine.
        // The only issue is unescaped control characters.

        // 6. Parse
        const result = JSON.parse(jsonString);

        // Top-level validation (basic)
        if (!result.metatype || !result.quadrants) {
            console.warn('Parsed JSON missing required top-level fields');
            return null;
        }

        return result as AssessmentReport;

    } catch (e) {
        // Only log if we had a marker but failed to parse, which indicates a real issue
        if (content.includes('[ASSESSMENT_COMPLETE]')) {
            // console.warn('Failed to parse assessment report:', e);
        }
        return null;
    }
};
