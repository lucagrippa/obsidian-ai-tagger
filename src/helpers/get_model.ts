import { Notice } from 'obsidian';
import { AiTaggerSettings } from '../main';
import { OPENAI, MISTRAL_AI, models } from '../models';
import { LLM } from "../llms/base";
import { OpenAiLLM } from "../llms/openai";
import { MistralAiLLM } from "../llms/mistralai";

// create a function to check if the model and API key are set
export function checkModelAndApiKey(settings: AiTaggerSettings): boolean {
    // using the model selected in settings, check if the model belongs to the company openAI or mistral AI and if the API key is set
    console.log("Settings:", settings.model)
    const modelInfo = models.find((model) => model.modelId === settings.model);

    if (!modelInfo) {
        throw new Error("Model not found");
    } else if (modelInfo.company === OPENAI && !settings.openAIApiKey) {
        throw new Error("Please set your OpenAI API key in the plugin settings.");
        // throw new Error('OpenAI API key not set');
    } else if (modelInfo.company === MISTRAL_AI && !settings.mistralAIApiKey) {
        throw new Error("Please set your Mistral AI API key in the plugin settings.");
        // throw new Error('Mistral AI API key not set');
    }

    return true
}

export function getLlm(settings: AiTaggerSettings): LLM {
    // using the model selected in settings, check if the model belongs to the company openAI or mistral AI and if the API key is set
    console.log("Settings:", settings.model)
    const modelInfo = models.find((model) => model.modelId === settings.model);

    if (!modelInfo) {
        throw new Error("Model not found");
    } else if (modelInfo.company === OPENAI) {
        if (typeof settings.openAIApiKey === "string" && settings.openAIApiKey.startsWith("sk")) {
            try {
                const llm = new OpenAiLLM(settings.model, settings.openAIApiKey)
                return llm
            } catch (error) {
                throw error;
            }
        } else {
            throw new Error("Please set your OpenAI API key in the plugin settings.");
            // throw new Error('OpenAI API key not set');
        }
    } else if (modelInfo.company === MISTRAL_AI) {
        if (typeof settings.mistralAIApiKey === "string") {
            try {
                const llm = new MistralAiLLM(settings.model, settings.mistralAIApiKey)
                return llm
            } catch (error) {
                throw error;
            }
        } else {
            throw new Error("Please set your Mistral AI API key in the plugin settings.");
            // throw new Error('Mistral AI API key not set');
        }
    } else {
        throw new Error("Error getting model.");
    }
}