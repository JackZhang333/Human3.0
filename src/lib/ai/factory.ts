import { AIProvider } from './types';
import { KimiProvider } from './providers/kimi';
import { MinimaxProvider } from './providers/minimax';
import { DeepSeekProvider } from './providers/deepseek';

export const AVAILABLE_PROVIDERS = [
    { id: 'minimax', name: 'MiniMax', version: 'M2.1' },
    { id: 'kimi', name: 'Kimi', version: 'k2.5' },
    { id: 'deepseek', name: 'DeepSeek', version: 'V4-Flash' },
] as const;

export class AIProviderFactory {
    static getProvider(name?: string): AIProvider {
        const providerName = (name || process.env.AI_PROVIDER || 'deepseek').toLowerCase();

        switch (providerName) {
            case 'kimi':
                return new KimiProvider();
            case 'minimax':
                return new MinimaxProvider();
            case 'deepseek':
                return new DeepSeekProvider();
            default:
                console.warn(`Unknown AI provider: ${providerName}, falling back to deepseek`);
                return new DeepSeekProvider();
        }
    }
}
