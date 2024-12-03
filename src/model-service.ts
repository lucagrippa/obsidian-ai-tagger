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

    static isTextWithinTokenLimit(text: string, prompt: string, tokenLimit: number): boolean {
        // Approximate token count (4 chars per token)
        const totalTokens = (text.length + prompt.length) / 4;
        return totalTokens <= tokenLimit;
    }
} 