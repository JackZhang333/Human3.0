import { BaseAIProvider } from './base';
import { Message, AIProviderOptions } from '../types';

export class KimiProvider extends BaseAIProvider {
    name = 'kimi';
    protected apiUrl = 'https://api.moonshot.cn/v1/chat/completions';
    protected apiKey = process.env.KIMI_API_KEY;

    protected prepareRequestBody(messages: Message[], options?: AIProviderOptions) {
        return {
            model: options?.model || 'kimi-k2.5',
            messages,
            stream: options?.stream ?? true,
            max_tokens: options?.maxTokens || 32768,
            temperature: 1, // Kimi models are strict about temperature
        };
    }
}
