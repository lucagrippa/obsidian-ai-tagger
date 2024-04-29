# AI Tagger
AI Tagger is an Obsidian (https://obsidian.md) plugin that simplifies tagging by using OpenAI's advance Large Language Models (LLMs) to analyze and tag your document with one click! 

The plugin analyzes the current document that you have open in the editor and all of the previous tags that you have used. AI tagger will return up to 5 relevant tags that you have previously used and will generate up to 3 completely new tags.

## How to use

### Supported LLM Providers
**OpenAI**
- `GPT-3.5-Turbo`
- `GPT-4`
- `GPT-4 Turbo`

**Mistral AI**
- `Mistral Small`
- `Mistral Large`

### Setting up the AI Tagger
- Enter your LLM provider API key in the settings tab. 
- Pick the model (LLM) that you would like to use

### One click tagging
- the simplest way to use the plugin is from the ribbon located on the left sidebar.
- click the "Wand" ribbon icon to automatically generate tags for your current document.

    ![One click tagging](images/one_click_tagging.gif)

### More precise tagging
- another way to call the AI Tagger is from the Command palette (`Ctrl+P` or `Cmd+P` on macOS).
- using the Command palette navigate to the "Generate tags" command to tag your current document.
- to tag a specific part of your document highlight the text before using the Command palette.

    ![Command palette tagging](images/command_palette_tagging.gif)

## Installation
Navigate to the Obsidian settings and search AI Tagger in the Community plugins section. You can also manually download the latest release from this repository's GitHub releases by extracting the ZIP file to your Obsidian plugins folder.

## Support
If you encounter any issues while using the AI Tagger plugin or have any suggestions for improvement, submit an issue on this GitHub repository. Pull requests are also welcome.

## License
[MIT License](LICENSE)
