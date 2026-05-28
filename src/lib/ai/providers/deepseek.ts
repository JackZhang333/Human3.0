import { BaseAIProvider } from './base';
import { Message, AIProviderOptions } from '../types';

export class DeepSeekProvider extends BaseAIProvider {
    name = 'deepseek';
    protected apiUrl = 'https://api.deepseek.com/chat/completions';
    protected apiKey = process.env.DEEPSEEK_API_KEY;

    protected prepareRequestBody(messages: Message[], options?: AIProviderOptions) {
        return {
            model: options?.model || 'deepseek-v4-flash',
            messages,
            stream: options?.stream ?? true,
            max_tokens: options?.maxTokens || 4096,
            temperature: options?.temperature ?? 0.7,
        };
    }
}
