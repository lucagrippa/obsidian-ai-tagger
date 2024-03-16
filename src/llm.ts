import { getAllTags, Notice } from 'obsidian';
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputKeyToolsParser, JsonOutputKeyToolsParserParams } from "@langchain/core/output_parsers/openai_tools";
import { Runnable } from '@langchain/core/runnables';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from "@langchain/core/prompts";


function getVaultTags() {
    const tagsSet = new Set(); // Use a set to ensure unique tags

    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
        const cache = this.app.metadataCache.getFileCache(file)
        const tags = getAllTags(cache);
        if (tags !== null) {
            for (const tag of tags) {
                tagsSet.add(tag);
            }
        }
    }

    return tagsSet;
}

// write a class to instantiate the chain and handle the prompts
export class LLM {
    baseURL: string | null;
    modelName: string;
    openAIApiKey: string;
    chain: Runnable;

    constructor(modelName: string, openAIApiKey: string, baseURL: string | null = null) {
        this.baseURL = baseURL;
        this.modelName = modelName;
        this.openAIApiKey = openAIApiKey;
        const prompt: ChatPromptTemplate = this.getPrompt();
        const functionCallingModel = this.getModel();

        const outputParser = new JsonOutputKeyToolsParser({
            keyName: "document_tagger",
            returnSingle: true,
        });

        this.chain = prompt.pipe(functionCallingModel!).pipe(outputParser);
    }

    getPrompt() {
        const systemMessage = `
    Tags are used to categorize and organize documents based on its content. Here are some existing tags that the user has created.

    EXISTING TAGS:
    {tagsString}

    Tag the following document based on its content. You can use between 1 and 5 of the EXISTING TAGS but also create 1 to 3 new tags. Ensure that the tags accurately reflect the article's primary focus and themes.
    `

        const humanMessage = "DOCUMENT: \n ```{document}``` \n TAGS: \n"

        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(systemMessage),
            HumanMessagePromptTemplate.fromTemplate(humanMessage),
        ]);

        return prompt;
    }

    getModel() {
        const zodSchema = z.object({
            tags: z.array(z.string()).describe("An array of tags that best describes the text using existing tags."),
            newTags: z.array(z.string()).describe("An array of tags that best describes the text using new tags."),
        });

        try {
            const llm = new ChatOpenAI({
                temperature: 0,
                modelName: this.modelName,
                openAIApiKey: this.openAIApiKey,
                configuration: {
                    baseURL: this.baseURL,
                    timeout: 10000, // 10 seconds
                }
            });
            
            // Binding "function_call" below makes the model always call the specified function.
            // If you want to allow the model to call functions selectively, omit it.
            const llmWithTools = llm.bind({
                tools: [
                    {
                        type: "function" as const,
                        function: {
                            name: "document_tagger",
                            description: "Should always be used to tag documents.",
                            parameters: zodToJsonSchema(zodSchema),
                        },
                    }
                ],
                tool_choice: {
                    type: "function" as const,
                    function: {
                        name: "document_tagger",
                    },
                },
            });

            return llmWithTools;
        } catch (error) {
            if (error.message.includes('OpenAI or Azure OpenAI API key not found at new ChatOpenAI')) {
                // Notify the user about the incorrect API key
                throw new Error('Incorrect API key. Please check your API key.');
            }
        }


    }

    formatTagsString(tags: string[], newTags: string[]) {
        // let tagsString = "tags: "
        let tagsString = ""
        tags.forEach((tag: string) => {
            tagsString += tag + " "
        });

        // if there are new tags, add a separator
        if (newTags.length > 0) {
            tagsString += "| "
            // tagsString += "\nnew tags: "

            newTags.forEach((tag: string) => {
                tagsString += tag + " "
            });
        }

        tagsString += "\n"

        return tagsString
    }

    isTextWithinLimit(text: string, modelName: string) {
        // Define token limits for the models
        const tokenLimitGPT4 = 8192;
        const tokenLimitGPT35Turbo = 4096;

        // Calculate the number of tokens based on average token length (4 characters)
        const numTokens = text.length / 4;

        // Check the model name and compare with the corresponding token limit
        if (modelName === 'gpt-4') {
            return numTokens <= tokenLimitGPT4;
        } else if (modelName === 'gpt-3.5-turbo') {
            return numTokens <= tokenLimitGPT35Turbo;
        } else {
            // Handle unsupported models or provide a default behavior
            console.error('Unsupported model:', modelName);
            return false;
        }
    }

    async generateTags(documentText: string) {
        // check if the text is within the limit
        // if (this.isTextWithinLimit(documentText, this.modelName)) {
        //     throw new Error('Your document is too long. Please reduce the length of your document.');
        // }

        console.log("Generating tags...")
        new Notice("Generating tags...")

        // get every tag in the current vault
        const vaultTags = getVaultTags()
        // create a string of tags to insert into the prompt as a list
        let tagsString = ""
        vaultTags.forEach(tag => {
            tagsString += "- " + tag + "\n"
        })

        try {
            const response = await this.chain.invoke({
                tagsString: tagsString,
                document: documentText,
            });
            console.log("LLM RESPONSE:", response)

            const tags = this.formatTagsString(response.tags, response.newTags)
            return tags
        } catch (error) {
            // print the type of error
            console.error('Error while invoking chain:', error.message);
            if (error.message.includes('Incorrect API key')) {
                // Notify the user about the incorrect API key
                throw new Error('Incorrect API key. Please check your API key.');
                // } else if (error.message.includes('Invalid Authentication')) {
                //     // Notify the user about the incorrect API key
                //     throw new Error('Incorrect API key. Please check your API key.');
                // } else if (error.message.includes('You must be a member of an organization to use the API')) {
                //     // Notify the user about the incorrect API key
                //     throw new Error('Your account is not part of an organization.  Contact OpenAI to get added to a new organization or ask your organization manager to invite you to an organization.');
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
            } else if (error.message.includes('Connection error') && this.baseURL !== null) {
                // Notify the user about the incorrect custom base URL
                throw new Error('Could not connect to custom base URL provided. Please check your custom base URL.');
            } else {
                throw new Error('Error while generating tags.');
            }

        }
    }
}
