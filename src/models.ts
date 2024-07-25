import { Notice } from 'obsidian';

export const OPENAI = "OpenAI";
export const MISTRAL_AI = "Mistral AI";

export const OPEN_SOURCE = "open-source";
export const CLOSED_SOURCE = "closed-source";

export interface ModelInfo {
    company: string;
    modelName: string;
    modelId: string;
    tokenLimit: number;
    type: string;
    toolUse: boolean;
}

export const models: Array<ModelInfo> = [
    {
        "company": OPENAI,
        "modelName": "GPT-3.5 Turbo",
        "modelId": "gpt-3.5-turbo-0125",
        "tokenLimit": 16385,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    {
        "company": OPENAI,
        "modelName": "GPT-4",
        "modelId": "gpt-4-0613",
        "tokenLimit": 8192,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    {
        "company": OPENAI,
        "modelName": "GPT-4 Turbo",
        "modelId": "gpt-4-turbo-2024-04-09",
        "tokenLimit": 128000,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    {
        "company": OPENAI,
        "modelName": "GPT-4o",
        "modelId": "gpt-4o-2024-05-13",
        "tokenLimit": 128000,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    {
        "company": OPENAI,
        "modelName": "GPT-4o mini",
        "modelId": "gpt-4o-mini-2024-07-18",
        "tokenLimit": 128000,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    // {
    //     "company": MISTRAL_AI,
    //     "modelName": "Mistral 7B",
    //     "modelId": "mistral-tiny-2312",
    //     "tokenLimit": 32768,
    //     "type": OPEN_SOURCE,
    //     "toolUse": true
    // },
    // {
    //     "company": MISTRAL_AI,
    //     "modelName": "Mixtral 8x7B",
    //     "modelId": "mistral-small-2312",
    //     "tokenLimit": 32768,
    //     "type": OPEN_SOURCE,
    //     "toolUse": true
    // },
    {
        "company": MISTRAL_AI,
        "modelName": "Mistral Small",
        "modelId": "mistral-small-2402",
        "tokenLimit": 32768,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    // {
    //     "company": MISTRAL_AI,
    //     "modelName": "Mistral Medium",
    //     "modelId": "mistral-medium-2312",
    //     "tokenLimit": 32768,
    //     "type": CLOSED_SOURCE,
    //     "toolUse": false
    // },
    {
        "company": MISTRAL_AI,
        "modelName": "Mistral Large",
        "modelId": "mistral-large-2402",
        "tokenLimit": 32768,
        "type": CLOSED_SOURCE,
        "toolUse": true
    }
];

export function getModelbyId(modelId: string) {
    const model = models.find((model) => model.modelId === modelId);
    
    if (!model) {
        throw new Error(`Model ${modelId} is not supported.`);
    }

    return model;
}

export function getModelTokenLimit(modelId: string) {
    try {
        const model = getModelbyId(modelId);
        return model.tokenLimit;
    } catch (error) {
        console.error('Error while getting model token limit:', error);
        throw error
    }    
}

export function isTextWithinLimit(prompt: string, text: string, modelName: string) {
    // Define token limits for the models
    const tokenLimit = getModelTokenLimit(modelName);

    // Calculate the number of tokens based on average token length (4 characters)
    const promptTokens = prompt.length / 4;
    const textTokens = text.length / 4;

    const totalTokens = promptTokens + textTokens;

    return totalTokens <= tokenLimit;
}