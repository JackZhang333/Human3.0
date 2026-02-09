import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSystemPrompt } from '@/lib/prompts';
import { extractAssessmentReport } from '@/lib/reportUtils';
import { AIProviderFactory } from '@/lib/ai/factory';

// 使用 Node.js Runtime 以支持完整的 Supabase 功能
export const runtime = 'nodejs';
export const maxDuration = 300; // 5分钟超时

export async function POST(request: NextRequest) {
    try {
        // Verify user is authenticated
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: '请先登录' },
                { status: 401 }
            );
        }

        const { messages, assessmentId, lang = 'zh' } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: lang === 'en' ? 'Invalid message format' : '无效的消息格式' },
                { status: 400 }
            );
        }

        // Get AI provider from factory
        const provider = AIProviderFactory.getProvider();

        // Prepare messages with system prompt
        const apiMessages = [
            { role: 'system' as const, content: getSystemPrompt(lang as 'zh' | 'en') },
            ...messages.map((m: { role: string; content: string }) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
            })),
        ];

        console.log(`Calling ${provider.name} API via abstraction with ${apiMessages.length} messages`);

        // 创建超时控制器 (4分钟超时)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 240000);

        // Call AI provider with streaming
        let streamResponse: ReadableStream;
        try {
            streamResponse = await provider.chatStream(apiMessages, {
                stream: true,
                // Options are set by provider defaults, but can be overridden here if needed
            });
        } catch (error) {
            console.error(`${provider.name} provider error:`, error);
            return NextResponse.json(
                { error: `${provider.name} AI 服务暂时不可用，请稍后重试` },
                { status: 502 }
            );
        }

        clearTimeout(timeoutId);

        // Transform SSE stream
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        let fullContent = '';
        let buffer = '';
        let savedToDb = false; // 标记是否已保存

        const transformStream = new TransformStream({
            async transform(chunk, ctrl) {
                const text = decoder.decode(chunk, { stream: true });
                buffer += text;

                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine.startsWith('data: ')) continue;

                    const data = trimmedLine.slice(6).trim();

                    if (data === '[DONE]') {
                        console.log('Received [DONE], saving to database...');
                        const cleanContent = fullContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                        if (assessmentId && !savedToDb) {
                            savedToDb = true;
                            await saveToDatabase(supabase, assessmentId, cleanContent, messages);
                        }
                        ctrl.enqueue(encoder.encode('data: [DONE]\n\n'));
                        continue;
                    }

                    try {
                        const json = JSON.parse(data);
                        const content = json.choices?.[0]?.delta?.content;

                        if (content) {
                            fullContent += content;
                            const cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, '');
                            if (cleanContent) {
                                ctrl.enqueue(encoder.encode(`data: ${JSON.stringify({ content: cleanContent })}\n\n`));
                            }
                        }
                    } catch {
                        // 静默忽略解析错误
                    }
                }
            },
            async flush(ctrl) {
                // 处理 buffer 中剩余的数据
                if (buffer.trim()) {
                    const trimmedLine = buffer.trim();
                    if (trimmedLine.startsWith('data: ')) {
                        const data = trimmedLine.slice(6).trim();
                        if (data === '[DONE]') {
                            console.log('Received [DONE] in flush, saving to database...');
                            const cleanContent = fullContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                            if (assessmentId && !savedToDb) {
                                savedToDb = true;
                                await saveToDatabase(supabase, assessmentId, cleanContent, messages);
                            }
                            ctrl.enqueue(encoder.encode('data: [DONE]\n\n'));
                        } else {
                            try {
                                const json = JSON.parse(data);
                                const content = json.choices?.[0]?.delta?.content;
                                if (content) {
                                    fullContent += content;
                                    const cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, '');
                                    if (cleanContent) {
                                        ctrl.enqueue(encoder.encode(`data: ${JSON.stringify({ content: cleanContent })}\n\n`));
                                    }
                                }
                            } catch {
                                // 忽略解析错误
                            }
                        }
                    }
                }

                // 确保即使没有收到 [DONE] 也保存对话
                if (!savedToDb && fullContent && assessmentId) {
                    console.log('Saving to database in flush (no [DONE] received)...');
                    savedToDb = true;
                    const cleanContent = fullContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                    await saveToDatabase(supabase, assessmentId, cleanContent, messages);
                }
            }
        });

        const stream = streamResponse.pipeThrough(transformStream);

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Assessment API error:', error);

        if (error instanceof Error && error.name === 'AbortError') {
            return NextResponse.json(
                { error: '请求超时，请重试。如果是在生成报告，请耐心等待。' },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { error: '评估服务发生错误，请稍后重试' },
            { status: 500 }
        );
    }
}

async function saveToDatabase(
    supabase: Awaited<ReturnType<typeof createClient>>,
    assessmentId: string,
    aiResponse: string,
    conversationMessages?: { role: string; content: string }[]
) {
    console.log('saveToDatabase called, assessmentId:', assessmentId, 'messages:', conversationMessages?.length || 0);

    try {
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        // 保存完整对话历史
        if (conversationMessages && conversationMessages.length > 0) {
            const cleanedConversation = conversationMessages.map(msg => ({
                role: msg.role,
                content: msg.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim(),
            }));
            const cleanAiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            // 只保存显示给用户的内容（不包含 ASSESSMENT_COMPLETE 标记）
            const displayContent = cleanAiResponse.replace(/\[ASSESSMENT_COMPLETE\][\s\S]*$/, '').trim();
            if (displayContent) {
                cleanedConversation.push({ role: 'assistant', content: displayContent });
            }
            updateData.conversation = cleanedConversation;
            console.log('Prepared conversation with', cleanedConversation.length, 'messages');
        }

        // Try to parse assessment result using the robust utility
        // The utility handles checking for [ASSESSMENT_COMPLETE] and extracting the JSON
        const result = extractAssessmentReport(aiResponse);

        if (result) {
            updateData.result = result;
            updateData.status = 'completed';
            console.log('Assessment completed, saving result');
        } else {
            console.log('Assessment not complete or result parsing failed (expected if still in progress)');
        }

        const { error } = await supabase
            .from('assessments')
            .update(updateData)
            .eq('id', assessmentId);

        if (error) {
            console.error('Database update error:', error);
        } else {
            console.log('Successfully saved to database');
        }
    } catch (error) {
        console.error('Failed to save to database:', error);
    }
}
