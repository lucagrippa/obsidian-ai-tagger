import { ModelConfig, MODEL_CONFIGS } from './model-config';
import { AiTaggerSettings } from './settings';

export class ModelService {
    static getModelById(modelId: string): ModelConfig {
        const model = MODEL_CONFIGS.find(model => model.modelId === modelId);
        if (!model) {
            throw new Error(`Model ${modelId} is not supported.`);
        }
        return model;
    }

    static getApiKey(settings: AiTaggerSettings, provider: string): string {
        return settings[`${provider}ApiKey`] || '';
    }

    static validateApiKey(key: string, provider: string): boolean {
        const patterns: Record<string, RegExp> = {
            openai: /^sk-[A-Za-z0-9-_]+$/,
            mistralai: /^[A-Za-z0-9-_]+$/,
            anthropic: /^sk-ant-api[A-Za-z0-9-_]+$/,
            groq: /^gsk_[A-Za-z0-9-_]+$/,
            ollama: /.*/,
        };
        return patterns[provider]?.test(key) ?? false;
    }

    static isTextWithinTokenLimit(text: string, prompt: string, tokenLimit: number): boolean {
        // Approximate token count (4 chars per token)
        const totalTokens = (text.length + prompt.length) / 4;
        return totalTokens <= tokenLimit;
    }
} 