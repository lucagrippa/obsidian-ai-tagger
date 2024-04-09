import { Notice } from 'obsidian';
import { AiTaggerSettings } from '../main';
import { OPENAI, MISTRAL_AI, models } from '../models';

// create a function to check if the model and API key are set
export function checkModelAndApiKey(settings: AiTaggerSettings) {
    // using the model selected in settings, check if the model belongs to the company openAI or mistral AI and if the API key is set
    console.log("Settings:", settings.model)
    const model = models.find((model) => model.modelId === settings.model);

    if (!model) {
        throw new Error('Model not found');
    } else if (model.company === OPENAI && !settings.openAIApiKey) {
        throw new Error("Please set your OpenAI API key in the plugin settings.");
        // throw new Error('OpenAI API key not set');
    } else if (model.company === MISTRAL_AI && !settings.mistralAIApiKey) {
        throw new Error("Please set your Mistral AI API key in the plugin settings.");
        // throw new Error('Mistral AI API key not set');
    }
}
