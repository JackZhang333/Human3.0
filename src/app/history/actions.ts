'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getSystemPrompt } from '@/lib/prompts';
import { AIProviderFactory } from '@/lib/ai/factory';

export async function deleteAssessment(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/history');
    return { success: true };
}

export async function regenerateAssessmentReport(id: string, providerName?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    // 1. 获取评估记录
    const { data: assessment, error: fetchError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !assessment) throw new Error('Assessment not found');

    // 2. 准备对话历史
    const messages = assessment.conversation || [];
    if (messages.length === 0) throw new Error('No conversation history to regenerate from');

    const provider = AIProviderFactory.getProvider(providerName);

    const apiMessages = [
        { role: 'system' as const, content: getSystemPrompt('zh') },
        ...messages.map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user' as const, content: '请基于以上对话，立即生成完整的评估报告 JSON 数据。确保包含 [ASSESSMENT_COMPLETE] 标记。' }
    ];

    try {
        // 3. 调用 AI API (非流式)
        const { content: aiResponse } = await provider.chat(apiMessages, {
            stream: false,
            temperature: 0.3,
            maxTokens: 4096,
        });

        if (!aiResponse) throw new Error('Empty AI response');

        // 4. 解析 JSON 并更新数据库
        const { extractAssessmentReport } = await import('@/lib/reportUtils');
        const result = extractAssessmentReport(aiResponse);

        if (!result) throw new Error('Failed to parse assessment result');

        const { error: updateError } = await supabase
            .from('assessments')
            .update({
                result,
                status: 'completed',
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updateError) throw updateError;

        revalidatePath('/history');
        revalidatePath(`/report/${id}`);

        return { success: true };
    } catch (err: any) {
        console.error('Regeneration error:', err);
        throw new Error(err.message || 'Failed to regenerate report');
    }
}
