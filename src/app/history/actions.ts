'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { SYSTEM_PROMPT } from '@/lib/prompts';

const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/chat/completions';

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

export async function regenerateAssessmentReport(id: string) {
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

    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) throw new Error('AI service not configured');

    const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        { role: 'user', content: '请基于以上对话，立即生成完整的评估报告 JSON 数据。确保包含 [ASSESSMENT_COMPLETE] 标记。' }
    ];

    try {
        // 3. 调用 AI API (非流式)
        const response = await fetch(MINIMAX_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'MiniMax-M2.1',
                messages: apiMessages,
                stream: false,
                max_tokens: 4096,
                temperature: 0.3, // 低温以获得更稳定的 JSON
            }),
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${await response.text()}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || '';

        if (!aiResponse) throw new Error('Empty AI response');

        // 4. 解析 JSON 并更新数据库
        // 这里我们简单复用解析逻辑
        const isComplete = aiResponse.includes('[ASSESSMENT_COMPLETE]');
        if (!isComplete) throw new Error('AI did not provide a complete assessment marker');

        const markerIndex = aiResponse.indexOf('[ASSESSMENT_COMPLETE]');
        const afterMarker = aiResponse.slice(markerIndex + '[ASSESSMENT_COMPLETE]'.length);
        const jsonStartIndex = afterMarker.indexOf('{');

        if (jsonStartIndex === -1) throw new Error('Could not find JSON in AI response');

        // 简陋但有效的括号匹配提取
        let depth = 0;
        let jsonEndIndex = -1;
        for (let i = jsonStartIndex; i < afterMarker.length; i++) {
            if (afterMarker[i] === '{') depth++;
            else if (afterMarker[i] === '}') {
                depth--;
                if (depth === 0) {
                    jsonEndIndex = i;
                    break;
                }
            }
        }

        if (jsonEndIndex === -1) throw new Error('Invalid JSON structure');

        let jsonStr = afterMarker.slice(jsonStartIndex, jsonEndIndex + 1);
        // 清理
        jsonStr = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        // 处理可能存在的换行
        const result = JSON.parse(jsonStr);

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
