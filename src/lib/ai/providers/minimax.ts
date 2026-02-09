import { BaseAIProvider } from './base';
import { Message, AIProviderOptions } from '../types';

export class MinimaxProvider extends BaseAIProvider {
    name = 'minimax';
    protected apiUrl = 'https://api.minimaxi.com/v1/chat/completions';
    protected apiKey = process.env.MINIMAX_API_KEY;

    protected prepareRequestBody(messages: Message[], options?: AIProviderOptions) {
        return {
            model: options?.model || 'MiniMax-M2.1',
            messages,
            stream: options?.stream ?? true,
            max_tokens: options?.maxTokens || 36398,
            temperature: options?.temperature ?? 0.7,
        };
    }
}
