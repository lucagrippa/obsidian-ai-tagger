import { ChatMistralAI } from "@langchain/mistralai";
import type { ToolChoice } from "@mistralai/mistralai";
import { Runnable } from '@langchain/core/runnables';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { JsonOutputKeyToolsParser, JsonOutputKeyToolsParserParams } from "@langchain/core/output_parsers/openai_tools";


import { LLM } from './base'
import { TagDocumentTool } from '../tool'
import { getTagsString } from '../helpers/get_tags';

export class MistralAiLLM extends LLM {
    model: Runnable;
    prompt: ChatPromptTemplate;

    constructor(modelId: string, apiKey: string) {
        super(modelId, apiKey)
        this.prompt = this.getPrompt();
        this.model = this.getModel();
    }

    getPrompt(): ChatPromptTemplate {
        const systemMessage = `
You are an expert at categorizing documents using tags. Your task is to create tags for the users document. Tags are used to categorize and organize documents based on its content. The format of a tag is a pound sign followed by the category "#<category>", for example "#networking".  
Here are some existing tags that you can use to categorize the document.

EXISTING TAGS:
\`\`\`
{tagsString}
\`\`\`

Tag the users document based on its content. You can use between 1 and 5 of the EXISTING TAGS but also create 1 to 3 NEW TAGS that you come up with on your own. Ensure that the tags accurately reflect the document's primary focus and themes.
`

        const humanMessage = "DOCUMENT:\n```{document}```"

        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(systemMessage),
            HumanMessagePromptTemplate.fromTemplate(humanMessage),
        ]);

        return prompt;
    }

    getModel(): Runnable {
        let model: ChatMistralAI;
        try {
            model = new ChatMistralAI({
                modelName: this.modelInfo.modelId,
                apiKey: this.apiKey,
                temperature: 0.0,
            });
        } catch (error) {
            if (error.message.includes('API key MISTRAL_API_KEY is missing for MistralAI, but it is required.')) {
                // Notify the user about the incorrect API key
                throw new Error('Please set your Mistral AI API key in the plugin settings.');
            } else {
                console.error('Error while instantiating model:', error.message);
                throw new Error('Error while instantiating model.');
            }
        }

        // check if model allows tool use (aka function calling)
        if (this.modelInfo.toolUse === true) {
            const tagDocumentTool = new TagDocumentTool()
            // Bind the tool to the model
            const modelWithTool: Runnable = model.bind({
                tools: [tagDocumentTool],
                // Input should be 'auto', 'none' or 'any'
                tool_choice: 'any' as ToolChoice
            });

            const outputParser: Runnable = new JsonOutputKeyToolsParser({
                keyName: tagDocumentTool.name,
                returnSingle: true,
            });

            const modelWithOutputParser = modelWithTool.pipe(outputParser)

            return modelWithOutputParser
        }
        return model
    }

    async generateTags(documentText: string): Promise<Array<string>> {
        const chain: Runnable = this.prompt.pipe(this.model)

        const tagsString: string = getTagsString()

        try {
            const response = await chain.invoke({
                tagsString: tagsString,
                document: documentText,
            });
            console.debug("LLM Response: ", response)

            const tags: Array<string> = this.formatOutputTags(response.tags, response.newTags)
            return tags
        } catch (error) {
            // print the type of error
            console.error('Error while invoking chain:', error.message);
            if (error.message.includes('HTTP error! status: 401')) {
                // Notify the user about the incorrect API key
                throw new Error('Incorrect API key. Please check your API key.');
            } else if (error.message.includes('HTTP error! status: 422')) {
                // Notify the user about the incorrect API key
                throw new Error('Incorrect API key. Please check your API key.');
            } else if (error.message.includes('Rate limit reached for requests')) {
                // Notify the user about the incorrect API key
                throw new Error('You are sending requests too quickly. Please pace your requests or read OpenAI\'s Rate limit guide.');
            } else if (error.message.includes('You exceeded your current quota, please check your plan and billing details')) {
                // Notify the user about running out of credits
                throw new Error('You have run out of OpenAI credits or hit your maximum monthly spend.');
            } else if (error.message.includes('The server had an error while processing your request')) {
                // Notify the user about an issue with OpenAI's servers
                throw new Error('Issue on OpenAI\'s servers. Please retry your request after a brief wait.');
            } else if (error.message.includes('The engine is currently overloaded, please try again later')) {
                // Notify the user about an issue with OpenAI's servers
                throw new Error('OpenAI\'s servers are experiencing high traffic. Please retry your requests after a brief wait.');
            } else if (error.message.includes('Please reduce the length')) {
                // Notify the user about the context length being too large
                throw new Error('Your document is too long. Please reduce the length of your document.');
            } else if (error.message.includes('Invalid URL')) {
                // Notify the user about the incorrect custom base URL
                throw new Error('Invalid custom base URL provided. Please check your custom base URL.');
            // } else if (error.message.includes('Connection error') && this.baseURL !== null && (this.modelName.includes('gpt-4') || this.modelName.includes('gpt-3.5-turbo'))) {
            //     // Notify the user about the incorrect custom base URL
            //     throw new Error('Could not connect to custom base URL provided. Please check your custom base URL.');
            } else {
                console.error('Error while generating tags:', error.message);
                throw new Error('Error while generating tags.');
            }
        }
    }
}