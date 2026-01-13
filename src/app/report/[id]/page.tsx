import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReportContent from './ReportContent';

export const dynamic = 'force-dynamic';

interface ReportPageProps {
    params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/report/' + id);
    }

    // Get assessment
    const { data: assessment, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !assessment) {
        redirect('/assess');
    }

    if (assessment.status !== 'completed' || !assessment.result) {
        redirect('/assess');
    }

    return <ReportContent assessment={assessment} />;
}
