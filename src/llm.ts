import { getAllTags, Notice } from 'obsidian';
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { RunnableSequence } from 'langchain/dist/schema/runnable';
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from "langchain/prompts";


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
    modelName: string;
    chain: RunnableSequence;

    constructor(modelName: string, openAIApiKey: string) {
        this.modelName = modelName;
        const prompt = this.getPrompt();
        const functionCallingModel = this.getModel(modelName, openAIApiKey);

        const outputParser = new JsonOutputFunctionsParser();
        this.chain = prompt.pipe(functionCallingModel).pipe(outputParser);
    }

    getPrompt() {
        const systemMessage = `
    Tags are used to categorize and organize documents based on its content. Here are some existing tags that the user has created.

    EXISTING TAGS:
    {tagsString}

    Tag the following document based on its content. You can use up to 5 existing tags and if necessary create up to 3 new tags. Ensure that the tags accurately reflect the article's primary focus and themes.
    `

        const humanMessage = "DOCUMENT: \n \"{document}\" \n TAGS: \n"

        const prompt = new ChatPromptTemplate({
            promptMessages: [
                SystemMessagePromptTemplate.fromTemplate(systemMessage),
                HumanMessagePromptTemplate.fromTemplate(humanMessage),
            ],
            inputVariables: ["tagsString", "document"],
        });

        return prompt;
    }

    getModel(modelName: string, openAIApiKey: string) {
        const zodSchema = z.object({
            tags: z.array(z.string()).describe("An array of tags that best describes the text using existing tags."),
            newTags: z.array(z.string()).describe("An array of tags that best describes the text using new tags."),
        });
        const llm = new ChatOpenAI({
            temperature: 0,
            modelName: modelName,
            openAIApiKey: openAIApiKey,
        });

        // Binding "function_call" below makes the model always call the specified function.
        // If you want to allow the model to call functions selectively, omit it.
        const functionCallingModel = llm.bind({
            functions: [
                {
                    name: "output_formatter",
                    description: "Should always be used to properly format output",
                    parameters: zodToJsonSchema(zodSchema),
                },
            ],
            function_call: { name: "output_formatter" },
        });

        return functionCallingModel;
    }

    formatTagsString(tags: string[], newTags: string[]) {
        let tagsString = "tags: "
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
        console.log("Generating tags...")
        new Notice("Generating tags...")

        // check if the text is within the limit
        if (!this.isTextWithinLimit(documentText, this.modelName)) {
            throw new Error('Your document is too long. Please reduce the length of your document.');
        }

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

            const tags = this.formatTagsString(response.tags, response.newTags)
            return tags
        } catch (error) {
            // print the type of error
            console.error('Error while invoking chain:', error.message);
            if (error.message.includes('Incorrect API key')) {
                // Notify the user about the incorrect API key
                throw new Error('Incorrect API key. Please check your API key.');
            }
            else if (error.message.includes('Please reduce the length')) {
                // Notify the user about the incorrect API key
                throw new Error('Your document is too long. Please reduce the length of your document.');
            } else {
                throw new Error('Error while generating tags.');
            }

        }
    }
}
