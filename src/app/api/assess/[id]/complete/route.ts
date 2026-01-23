import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Params is a Promise in Next.js 15
) {
    try {
        const { id } = await context.params;
        const assessmentId = id;

        // 1. Authenticate
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 2. Parse body
        const { result } = await request.json();

        if (!result) {
            return NextResponse.json(
                { error: 'Missing report result' },
                { status: 400 }
            );
        }

        // 3. Update Status
        const { error } = await supabase
            .from('assessments')
            .update({
                status: 'completed',
                result: result,
                updated_at: new Date().toISOString()
            })
            .eq('id', assessmentId)
            .eq('user_id', user.id); // Security: ensure user owns the assessment

        if (error) {
            console.error('Failed to update assessment status:', error);
            return NextResponse.json(
                { error: 'Database update failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Completion API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
