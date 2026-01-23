import { describe, it, expect } from 'vitest';
import { extractAssessmentReport } from './reportUtils';

describe('extractAssessmentReport', () => {
    it('extracts clear single-line JSON', () => {
        const input = `Some intro text...
[ASSESSMENT_COMPLETE]
{"metatype": {"name": "Test"}, "quadrants": []}`;
        const result = extractAssessmentReport(input);
        expect(result).not.toBeNull();
        expect(result?.metatype.name).toBe('Test');
    });

    it('extracts JSON surrounded by markdown code blocks', () => {
        const input = `Here is your report:
[ASSESSMENT_COMPLETE]
\`\`\`json
{"metatype": {"name": "Markdown Test"}, "quadrants": []}
\`\`\``;
        const result = extractAssessmentReport(input);
        expect(result).not.toBeNull();
        expect(result?.metatype.name).toBe('Markdown Test');
    });

    it('handles newlines in JSON structure', () => {
        const input = `[ASSESSMENT_COMPLETE]
{
    "metatype": {
        "name": "Formatted Test"
    },
    "quadrants": [
        {}
    ]
}`;
        const result = extractAssessmentReport(input);
        expect(result).not.toBeNull();
        expect(result?.metatype.name).toBe('Formatted Test');
    });

    it('ignores trailing text', () => {
        const input = `[ASSESSMENT_COMPLETE] {"metatype": {"name": "Trailing Test"}, "quadrants": []} And here is some advice...`;
        const result = extractAssessmentReport(input);
        expect(result).not.toBeNull();
        expect(result?.metatype.name).toBe('Trailing Test');
    });

    it('returns null if marker is missing', () => {
        const input = `{"metatype": {"name": "No Marker"}, "quadrants": []}`;
        const result = extractAssessmentReport(input);
        expect(result).toBeNull();
    });

    it('returns null if JSON is incomplete', () => {
        const input = `[ASSESSMENT_COMPLETE] {"metatype": {"name": "Incomplete"`;
        const result = extractAssessmentReport(input);
        expect(result).toBeNull();
    });

    it('handles nested braces correctly', () => {
        const input = `[ASSESSMENT_COMPLETE] {"metatype": {}, "quadrants": [], "data": {"nested": {"deep": true}}, "list": [{}]}`;
        const result = extractAssessmentReport(input) as any;
        expect(result).not.toBeNull();
        expect(result.data.nested.deep).toBe(true);
    });

    it('handles escaped quotes inside strings', () => {
        const input = `[ASSESSMENT_COMPLETE] {"metatype": {"description": "Saying \\"hello\\" world"}, "quadrants": []}`;
        const result = extractAssessmentReport(input) as any;
        expect(result).not.toBeNull();
        expect(result.metatype.description).toBe('Saying "hello" world');
    });
});
