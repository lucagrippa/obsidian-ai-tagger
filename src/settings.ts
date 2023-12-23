import AiPlugin from "./main";
import { App, PluginSettingTab, Setting } from 'obsidian';

export class AiPluginSettingTab extends PluginSettingTab {
    plugin: AiPlugin;

    constructor(app: App, plugin: AiPlugin) {
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
                    .setPlaceholder('Enter your API key')
                    .setValue(this.plugin.settings.openai_api_key)
                    // Update the settings object whenever the value of the text field changes, and then save it to disk:
                    .onChange(async (value) => {
                        this.plugin.settings.openai_api_key = value;
                        await this.plugin.saveSettings();
                    })
                );

        new Setting(containerElement)
            .setName('Model')
            .setDesc('Pick the model you would like to use from OpenAI')
            .addDropdown(dropDown => {
                dropDown.addOptions({
                    'gpt-4': 'GPT-4',
                    'gpt-3.5-turbo': 'GPT-3.5-Turbo',
                });
                dropDown.setValue(this.plugin.settings.model); // Set the value here
                dropDown.onChange(async (value) => {
                    this.plugin.settings.model = value;
                    await this.plugin.saveSettings();
                });
            });
    }
}