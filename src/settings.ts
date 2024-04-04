import AiTagger from "./main";
import { App, PluginSettingTab, Setting } from 'obsidian';

export class AiTaggerSettingTab extends PluginSettingTab {
    plugin: AiTagger;

    constructor(app: App, plugin: AiTagger) {
        super(app, plugin);
        this.plugin = plugin;
    }

    // display() is where you build the content for the settings tab.
    display(): void {
        const { containerEl: containerElement } = this;

        containerElement.empty();

        // new Setting(containerEl) appends a setting to the container element.
        // This uses a text field using addText(), but there are several other setting types available.
        new Setting(containerElement)
            .setName('OpenAI API Key')
            .setDesc('Your API key for OpenAI')
            .addText(text =>
                text
                    .setPlaceholder('Enter API key')
                    .setValue(this.plugin.settings.openAIApiKey)
                    // Update the settings object whenever the value of the text field changes, and then save it to disk:
                    .onChange(async (value) => {
                        this.plugin.settings.openAIApiKey = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerElement)
            .setName('Groq API Key')
            .setDesc('Your API key for Groq')
            .addText(text =>
                text
                    .setPlaceholder('Enter API key')
                    .setValue(this.plugin.settings.groqApiKey)
                    // Update the settings object whenever the value of the text field changes, and then save it to disk:
                    .onChange(async (value) => {
                        this.plugin.settings.groqApiKey = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerElement)
            .setName('Model')
            .setDesc('Pick the model you would like to use')
            .addDropdown(dropDown => {
                dropDown.addOptions({
                    'gpt-4': 'OpenAI GPT-4',
                    'gpt-3.5-turbo': 'OpenAI GPT-3.5-Turbo',
                    'llama2-70b-4096': 'Groq LLaMA2 70b',
                    'mixtral-8x7b-32768': 'Groq Mixtral 8x7b',
                    'gemma-7b-it': 'Groq Gemma 7b',
                });
                dropDown.setValue(this.plugin.settings.model); // Set the value here
                dropDown.onChange(async (value) => {
                    this.plugin.settings.model = value;
                    await this.plugin.saveSettings();
                });
            });

        // Override the default base URL for the model's API, leave blank if not using a proxy or service emulator.
        // Base URL path for API requests, leave blank if not using a proxy or service emulator.
        new Setting(containerElement)
            .setName('Custom Base URL')
            .setDesc('Override the default base URL for the model\'s API, leave blank if not using a proxy or service emulator.')
            .addText(text =>
                text
                    .setPlaceholder('Enter custom Base URL')
                    .setValue(this.plugin.settings.custom_base_url)
                    // Update the settings object whenever the value of the text field changes, and then save it to disk:
                    .onChange(async (value) => {
                        this.plugin.settings.custom_base_url = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}