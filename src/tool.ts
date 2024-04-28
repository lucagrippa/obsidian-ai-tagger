import { z, ZodObject } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { StructuredTool } from "@langchain/core/tools";


// Extend the StructuredTool class to create a new tool
export class TagDocumentTool extends StructuredTool {
    name: string = "document_tagger";
    description: string = "A tool to tag documents based on the content and themes of the document. Should always be used to tag documents.";
    schema = z.object({
        tags: z.array(z.string()).describe("An array of existing tags in the form \"#<existing_catgeory>\" that best categorizes the document."),
        newTags: z.array(z.string()).describe("An array of new tags in the form \"#<new_catgeory>\" that best categorizes the document."),
    });

    async _call(input: z.infer<typeof this.schema>) {
        return JSON.stringify(input);
    }
}