// Human 3.0 评估系统 - MiniMax AI 集成

const MINIMAX_API_URL = 'https://api.minimaxi.com/v1/chat/completions';

export interface MiniMaxMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface MiniMaxResponse {
    id: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export async function chatCompletion(
    messages: MiniMaxMessage[],
    options?: {
        stream?: boolean;
        maxTokens?: number;
        temperature?: number;
    }
): Promise<Response> {
    const apiKey = process.env.MINIMAX_API_KEY;

    if (!apiKey) {
        throw new Error('MINIMAX_API_KEY is not configured');
    }

    const response = await fetch(MINIMAX_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'MiniMax-M2.1',
            messages,
            stream: options?.stream ?? true,
            max_tokens: options?.maxTokens ?? 4096,
            temperature: options?.temperature ?? 0.8,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`MiniMax API error: ${response.status} - ${error}`);
    }

    return response;
}

export async function streamChatCompletion(
    messages: MiniMaxMessage[]
): Promise<ReadableStream<Uint8Array>> {
    const response = await chatCompletion(messages, { stream: true });

    if (!response.body) {
        throw new Error('Response body is null');
    }

    return response.body;
}

// 解析 SSE 流
export function parseSSEStream(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
        async start(controller) {
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    controller.close();
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        if (data === '[DONE]') {
                            controller.close();
                            return;
                        }

                        try {
                            const json = JSON.parse(data);
                            const content = json.choices?.[0]?.delta?.content;

                            if (content) {
                                controller.enqueue(new TextEncoder().encode(content));
                            }
                        } catch {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        },
    });
}
