
export const OPENAI = "OpenAI";
export const MISTRAL_AI = "Mistral AI";

export const OPEN_SOURCE = "open-source";
export const CLOSED_SOURCE = "closed-source";

export const models = [
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
        "modelName": "GPT-3.5 Turbo",
        "modelId": "gpt-3.5-turbo-0125",
        "tokenLimit": 16385,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    {
        "company": MISTRAL_AI,
        "modelName": "Mistral 7B",
        "modelId": "mistral-tiny-2312",
        "tokenLimit": 32768,
        "type": OPEN_SOURCE,
        "toolUse": true
    },
    {
        "company": MISTRAL_AI,
        "modelName": "Mixtral 8x7B",
        "modelId": "mistral-small-2312",
        "tokenLimit": 32768,
        "type": OPEN_SOURCE,
        "toolUse": true
    },
    {
        "company": MISTRAL_AI,
        "modelName": "Mistral Small",
        "modelId": "mistral-small-2402",
        "tokenLimit": 32768,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    {
        "company": MISTRAL_AI,
        "modelName": "Mistral Medium",
        "modelId": "mistral-medium-2312",
        "tokenLimit": 32768,
        "type": CLOSED_SOURCE,
        "toolUse": true
    },
    {
        "company": MISTRAL_AI,
        "modelName": "Mistral Large",
        "modelId": "mistral-large-2402",
        "tokenLimit": 32768,
        "type": CLOSED_SOURCE,
        "toolUse": true
    }
];
