export const COMPANIES = {
    OPENAI: "OpenAI",
    MISTRAL_AI: "Mistral AI",
    ANTHROPIC: "Anthropic",
    GROQ: "Groq",
    GOOGLE_GEN_AI: "Google Gen AI",
    OLLAMA: "Ollama",
} as const;

export const MODEL_TYPES = {
    OPEN_SOURCE: "open-source",
    CLOSED_SOURCE: "closed-source"
} as const;

export interface ModelConfig {
    company: keyof typeof COMPANIES;
    provider: string;
    modelName: string;
    modelId: string;
    tokenLimit: number;
    type: keyof typeof MODEL_TYPES;
    toolUse: boolean;
}

export const MODEL_CONFIGS: ModelConfig[] = [
    {
        company: "OPENAI",
        provider: "openai",
        modelName: "GPT-4o mini",
        modelId: "gpt-4o-mini",
        tokenLimit: 128000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "OPENAI",
        provider: "openai",
        modelName: "GPT-4o",
        modelId: "gpt-4o",
        tokenLimit: 128000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "MISTRAL_AI",
        provider: "mistralai",
        modelName: "Mistral Small",
        modelId: "mistral-small-latest",
        tokenLimit: 32768,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "MISTRAL_AI",
        provider: "mistralai",
        modelName: "Mistral Large",
        modelId: "mistral-large-latest",
        tokenLimit: 128000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "MISTRAL_AI",
        provider: "mistralai",
        modelName: "Mistral Nemo",
        modelId: "open-mistral-nemo",
        tokenLimit: 128000,
        type: "OPEN_SOURCE",
        toolUse: true
    },
    {
        company: "ANTHROPIC",
        provider: "anthropic",
        modelName: "Claude 3.5 Haiku",
        modelId: "claude-3-5-haiku-latest",
        tokenLimit: 200000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "ANTHROPIC",
        provider: "anthropic",
        modelName: "Claude 3.5 Sonnet",
        modelId: "claude-3-5-sonnet-latest",
        tokenLimit: 200000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "ANTHROPIC",
        provider: "anthropic",
        modelName: "Claude 3 Opus",
        modelId: "claude-3-opus-latest",
        tokenLimit: 200000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "GROQ",
        provider: "groq",
        modelName: "Llama 3 Groq 8B",
        modelId: "llama3-groq-8b-8192-tool-use-preview",
        tokenLimit: 8192,
        type: "OPEN_SOURCE",
        toolUse: true
    },
    {
        company: "GROQ",
        provider: "groq",
        modelName: "Llama 3 Groq 70B",
        modelId: "llama3-groq-70b-8192-tool-use-preview",
        tokenLimit: 8192,
        type: "OPEN_SOURCE",
        toolUse: true
    },
    {
        company: "GROQ",
        provider: "groq",
        modelName: "Llama 3.1 8B",
        modelId: "llama-3.1-8b-instant",
        tokenLimit: 128000,
        type: "OPEN_SOURCE",
        toolUse: true
    },
    {
        company: "GROQ",
        provider: "groq",
        modelName: "Llama 3.1 70B",
        modelId: "llama-3.1-70b-versatile",
        tokenLimit: 128000,
        type: "OPEN_SOURCE",
        toolUse: true
    },
    {
        company: "GOOGLE_GEN_AI",
        provider: "google-genai",
        modelName: "Gemini 1.5 Flash",
        modelId: "gemini-1.5-flash",
        tokenLimit: 1000000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "GOOGLE_GEN_AI",
        provider: "google-genai",
        modelName: "Gemini 1.5 Flash-8B",
        modelId: "gemini-1.5-flash-8b",
        tokenLimit: 1000000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "GOOGLE_GEN_AI",
        provider: "google-genai",
        modelName: "Gemini 1.5 Pro",
        modelId: "gemini-1.5-pro",
        tokenLimit: 1000000,
        type: "CLOSED_SOURCE",
        toolUse: true
    },
    {
        company: "OLLAMA",
        provider: "ollama",
        modelName: "Llama 3.2",
        modelId: "llama3.2",
        tokenLimit: 128000,
        type: "OPEN_SOURCE",
        toolUse: true
    },
    {
        company: "OLLAMA",
        provider: "ollama",
        modelName: "Mistral Nemo",
        modelId: "mistral-nemo",
        tokenLimit: 128000,
        type: "OPEN_SOURCE",
        toolUse: true
    },
    {
        company: "OLLAMA",
        provider: "ollama",
        modelName: "Qwen 2.5",
        modelId: "qwen2.5",
        tokenLimit: 128000,
        type: "OPEN_SOURCE",
        toolUse: true
    }
];