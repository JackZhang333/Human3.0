import { Message, AIProvider, AIProviderOptions } from '../types';

export abstract class BaseAIProvider implements AIProvider {
    abstract name: string;
    protected abstract apiUrl: string;
    protected abstract apiKey: string | undefined;

    async chatStream(messages: Message[], options?: AIProviderOptions): Promise<ReadableStream> {
        if (!this.apiKey) {
            throw new Error(`AI Provider ${this.name} API key is not configured`);
        }

        const response = await this.fetchWithRetry(this.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.prepareRequestBody(messages, options)),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${this.name} API error: ${response.status} ${errorText}`);
        }

        return response.body!;
    }

    async chat(messages: Message[], options?: AIProviderOptions): Promise<{ content: string }> {
        if (!this.apiKey) {
            throw new Error(`AI Provider ${this.name} API key is not configured`);
        }

        const response = await this.fetchWithRetry(this.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.prepareRequestBody(messages, { ...options, stream: false })),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${this.name} API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return {
            content: data.choices?.[0]?.message?.content || '',
        };
    }

    protected abstract prepareRequestBody(messages: Message[], options?: AIProviderOptions): any;

    protected async fetchWithRetry(
        url: string,
        options: RequestInit,
        maxRetries: number = 2
    ): Promise<Response> {
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);

                if (response.ok || response.status < 500) {
                    return response;
                }

                console.log(`${this.name} API attempt ${attempt + 1} failed with status ${response.status}, retrying...`);
                lastError = new Error(`HTTP ${response.status}`);
            } catch (error) {
                console.log(`${this.name} API attempt ${attempt + 1} failed with error:`, error);
                lastError = error instanceof Error ? error : new Error(String(error));
            }

            if (attempt === maxRetries) break;

            const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        throw lastError || new Error(`All ${this.name} API retry attempts failed`);
    }
}
