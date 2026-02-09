export type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
    role: MessageRole;
    content: string;
}

export interface StreamResponse {
    content?: string;
    isDone?: boolean;
    error?: string;
}

export interface AIProviderOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}

export interface AIProvider {
    name: string;
    chatStream(messages: Message[], options?: AIProviderOptions): Promise<ReadableStream>;
    chat(messages: Message[], options?: AIProviderOptions): Promise<{ content: string }>;
}
