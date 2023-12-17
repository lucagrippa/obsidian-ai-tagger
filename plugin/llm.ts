import { getAllTags } from 'obsidian';
import { LLMChain } from "langchain/chains";


import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

async function getVaultTags() {
    const tagsSet = new Set(); // Use a set to ensure unique tags

    const files = await this.app.vault.getMarkdownFiles();
    for (const file of files) {
        const cache = this.app.metadataCache.getFileCache(file)
        const tags = getAllTags(cache);
        if (tags !== null) {
            console.log('Tags:', tags);
            for (const tag of tags) {
                tagsSet.add(tag);
            }
        }
    }

    return tagsSet;
}

const systemMessage = `
Categorize the following document based on its content. Your task is to generate relevant tags or categories that accurately represent the main themes and subject matter discussed in the document. Please provide tags or categories that best describe the content.

Existing Tags/Categories:
{tagsString}

Use existing tags if they are relevant otherwise create new ones. Ensure that the tags accurately reflect the article's primary focus and themes. Return 10 tags or categories as a JSON list.

Document:
"I'm working on a web application project called "TaskMaster." TaskMaster is a task management tool designed to streamline productivity and collaboration within teams. The application allows users to create tasks, assign them to team members, set due dates, and monitor progress. It also includes real-time chat and file sharing features to facilitate communication. TaskMaster is built using the MERN stack (MongoDB, Express.js, React, Node.js) and integrates with third-party APIs for enhanced functionality."

Tags:
["#TaskManagement", "#WebApplication", "#TeamCollaboration", "#MERNStacl", "#ProductivityTools"]

Document:
"Today was a well-rounded day that began with an early trip to the gym. The workout was invigorating and set a positive tone for the day. Afterward, I enjoyed a wholesome breakfast and some quality time with a good book. In the afternoon, I ventured into the nearby park for a relaxing walk, taking in the beauty of nature. The evening was spent catching up with friends over a virtual gathering, sharing laughter and stories."

Tags:
["#Gym", "#Fitness", "#Reading", "#Nature", "#Socializing"]
`

const humanMessage = "Document: \n \"{document}\" \n Tags: \n"

// write a class to instantiate the chain and handle the prompts
export class LLM {
    chain: LLMChain;
    constructor(modelName: string, openAIApiKey: string) {
        const chat = new ChatOpenAI({
            temperature: 0,
            modelName: modelName,
            openAIApiKey: openAIApiKey
        });
        const chatPrompt = ChatPromptTemplate.fromMessages([
            ["system", systemMessage],
            ["human", humanMessage],
        ]);

        this.chain = new LLMChain({
            prompt: chatPrompt,
            llm: chat,
        });
    }

    async createTags(text: string) {
        // get every tag in the current vault
        let vaultTags = await getVaultTags()
        console.log(vaultTags)
        // create a string of tags to insert into the prompt as a list
        let tagsString = ""
        vaultTags.forEach(tag => {
            tagsString += "- " + tag + "\n"
        })
        console.log(tagsString)

        try {
            const response = await this.chain.call({
                tagsString: tagsString,
                document: text,
            });
    
            // parse the text as JSON
            const jsonObject = JSON.parse(response.text);
            console.log("jsonObject");
            console.log(jsonObject);
    
            let tags = "";
            jsonObject.forEach((tag: string) => {
                tags += tag + ", ";
            });
            console.log(tags);
    
            return tags.slice(0, -2) + "\n";
        } catch (error) {
            console.error('Error parsing tags:', error);
            throw error; // Optional: Rethrow the error to handle it further up the call stack.
        }
    }
}




const zodSchema = z.object({
  tags: z.array(z.string()).describe("An array of tags that best describes the text using existing tags."),
  newTags: z.array(z.string()).describe("An array of tags that best describes the text using new tags."),
});

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
  inputVariables: ["document"],
});

const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo-0613", temperature: 0 });

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

const outputParser = new JsonOutputFunctionsParser();

const chain = prompt.pipe(functionCallingModel).pipe(outputParser);

const response = await chain.invoke({
  document: "I like apples, bananas, oxygen, and french fries.",
});

console.log(JSON.stringify(response, null, 2));

/*
  {
    "output": {
      "foods": [
        {
          "name": "apples",
          "healthy": true,
          "color": "red"
        },
        {
          "name": "bananas",
          "healthy": true,
          "color": "yellow"
        },
        {
          "name": "french fries",
          "healthy": false,
          "color": "golden"
        }
      ]
    }
  }
*/