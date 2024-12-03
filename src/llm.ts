import { Notice, Plugin } from 'obsidian';
import { join } from 'path';
import { z } from "zod";

import { ModelConfig } from './model-config'
import { ModelService } from './model-service';
import { getTagsString } from './utils';
import { examples } from './prompts/examples';
import { systemMessage } from './prompts/system-prompt';

import { Runnable } from '@langchain/core/runnables';
import {
    FewShotChatMessagePromptTemplate,
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { initChatModel } from "langchain/chat_models/universal";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

const tagger = z.object({
    tags: z.array(z.string()).describe("An array of existing tags in the form \"#<existing_catgeory>\" that best categorizes the document."),
    newTags: z.array(z.string()).describe("An array of new tags in the form \"#<new_catgeory>\" that best categorizes the document."),
});

export class LLM {
    modelId: string;
    apiKey: string;
    plugin: Plugin;
    baseUrl: string | null;
    modelConfig: ModelConfig;
    prompt: ChatPromptTemplate;
    model: Runnable;

    constructor(modelId: string, apiKey: string, plugin: Plugin, baseURL: string | null = null) {
        this.modelId = modelId;
        this.apiKey = apiKey;
        this.plugin = plugin;
        this.baseUrl = baseURL;
        this.modelConfig = ModelService.getModelById(modelId);
    }

    static async initialize(modelId: string, apiKey: string, plugin: Plugin, baseUrl: string | null = null): Promise<LLM> {
        const instance = new LLM(modelId, apiKey, plugin, baseUrl);
        instance.model = await instance.getModel();
        instance.prompt = await instance.getPrompt();
        return instance;
    }

    async getModel() {
        try {
            let model: BaseChatModel = await initChatModel(this.modelId, {
                modelProvider: this.modelConfig.provider,
                temperature: 0,
                apiKey: this.apiKey,
                baseUrl: this.baseUrl,
                timeout: 10000,
                clientOptions: {
                    dangerouslyAllowBrowser: true,
                },
            });
            return model.withStructuredOutput(tagger);
        } catch (error) {
            console.error(`Error while instantiating model: ${this.modelConfig.company} ${this.modelConfig.modelId}`, error.message);
            throw new Error(`Error while instantiating model: ${this.modelConfig.company} ${this.modelConfig.modelId}`);
        }
    }

    getExamplePrompt() {
        const examplePrompt = ChatPromptTemplate.fromMessages([
            ["human", "EXISTING TAGS:\n```\n{inputTags}\n```\n\nDOCUMENT:\n```\n{document}\n```"],
            ["ai", "{response}"],
        ]);

        const formattedExamples = examples.slice(0, 3).map(example => ({
            // Convert array to string
            inputTags: Array.isArray(example.inputTags)
                ? example.inputTags.map(tag => ` - ${tag}`).join('\n')
                : example.inputTags,
            document: example.document,
            // json dump of response
            response: JSON.stringify(example.response),
        }));

        const fewShotPrompt = new FewShotChatMessagePromptTemplate({
            examplePrompt,
            examples: formattedExamples,
            inputVariables: [], // no input variables
        });

        return fewShotPrompt;
    }

    async getPrompt() {
        try {
            console.log("System message loaded:", systemMessage.substring(0, 100) + "..."); // Log first 100 chars
            console.log("Example prompt:", await this.getExamplePrompt().formatMessages({}));
            const humanMessage = "EXISTING TAGS:\n```\n{inputTags}\n```\n\nDOCUMENT:\n```\n{document}\n```";
            const fewShotPrompt = this.getExamplePrompt();
            const prompt = ChatPromptTemplate.fromMessages([
                SystemMessagePromptTemplate.fromTemplate(systemMessage),
                ...(await fewShotPrompt.formatMessages({})),
                HumanMessagePromptTemplate.fromTemplate(humanMessage),
            ]);

            return prompt;
        } catch (error) {
            console.error("Error loading prompt:", error);
            console.error("Plugin dir:", this.plugin.manifest.dir);
            throw new Error(`Failed to load system prompt: ${error.message}`);
        }
    }

    isTextWithinLimit(prompt: string, text: string): boolean {
        // Define token limits for the models
        const tokenLimit: number = this.modelConfig.tokenLimit;

        // Calculate the number of tokens based on average token length (4 characters)
        const promptTokens = prompt.length / 4;
        const textTokens = text.length / 4;

        const totalTokens = promptTokens + textTokens;

        return totalTokens <= tokenLimit;
    }

    formatOutputTags(tags: string[], newTags: string[], existingTags: string[]): string[] {
        const tagsArray = [...tags, ...newTags]
        // remove existing tags from tagsArray
        const filteredTagsArray = tagsArray.filter(tag =>
            !existingTags.some(existingTag =>
                existingTag.toLowerCase() === tag.toLowerCase()
            )
        )

        return filteredTagsArray
    }

    async generateTags(documentText: string, existingTags: string[]): Promise<string[]> {
        const chain: Runnable = this.prompt.pipe(this.model)
        const tagsString: string = getTagsString(existingTags)

        try {
            const response = await chain.invoke({
                inputTags: tagsString,
                document: documentText,
            });

            console.debug("LLM Response: ", response)

            const tags: string[] = this.formatOutputTags(response.tags, response.newTags, existingTags)
            return tags
        } catch (error) {
            // print the type of error
            console.error(`Error while generating tags: ${this.modelConfig.company} ${this.modelConfig.modelId}`, error.message);

            // Check for CORS-related errors
            if (this.modelConfig.provider !== 'ollama' && this.baseUrl && (error.message?.includes('CORS') || error.message?.includes('Access-Control-Allow-Headers'))) {
                throw new Error('Error: Is "Custom Base URL" supported by this model?');
            }

            if (this.modelConfig.provider === 'ollama') {
                const baseUrl = this.baseUrl?.trim();
                if (!baseUrl) {
                    const errorMessage = 'Error: Base URL not set. Please configure in settings';
                    throw new Error(errorMessage);
                }
                const errorMessage = 'Error: Check if Ollama is running and model is installed';
                throw new Error(errorMessage);
            } else if (this.modelConfig.provider !== 'ollama' && this.baseUrl) {
                const errorMessage = 'Error: Base URL is set, remove it if not using a proxy or service emulator';
                throw new Error(errorMessage);
            }
            throw new Error('Error while generating tags.');
        }
    }
}