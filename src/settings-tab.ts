import AiTagger from "./main";
import { App, PluginSettingTab, Setting } from 'obsidian';
import { MODEL_CONFIGS, COMPANIES } from './model-config';

export class AiTaggerSettingTab extends PluginSettingTab {
    plugin: AiTagger;

    constructor(app: App, plugin: AiTagger) {
        super(app, plugin);
        this.plugin = plugin;
    }

    private addApiKeySetting(containerEl: HTMLElement, companyKey: keyof typeof COMPANIES) {
        console.log('Company Key passed in:', companyKey);
        const providerConfig = MODEL_CONFIGS.find(config => config.company === companyKey);
        console.log('Found config:', providerConfig);
        if (!providerConfig) return;

        new Setting(containerEl)
            .setName(`${COMPANIES[companyKey]} API Key`)
            .setDesc(`Your API key for ${COMPANIES[companyKey]}`)
            .addText(text =>
                text
                    .setPlaceholder('Enter API key')
                    .setValue(this.plugin.settings[`${providerConfig.provider}ApiKey`])
                    .onChange(async (value) => {
                        this.plugin.settings[`${providerConfig.provider}ApiKey`] = value;
                        await this.plugin.saveSettings();
                    })
            );
    }

    // display() is where you build the content for the settings tab.
    display(): void {
        const { containerEl: containerElement } = this;
        containerElement.empty();

        // Add API key settings dynamically
        (Object.keys(COMPANIES) as (keyof typeof COMPANIES)[]).forEach(companyKey => {
            this.addApiKeySetting(containerElement, companyKey);
        });

        const modelOptions = Object.fromEntries(
            MODEL_CONFIGS.map(model => [
                model.modelId,
                `${COMPANIES[model.company]} ${model.modelName}`
            ])
        );

        new Setting(containerElement)
            .setName('Model')
            .setDesc('Pick the model you would like to use')
            .addDropdown(dropDown => {
                dropDown.addOptions(modelOptions);
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
            .setDesc('Override the default base URL for the model\'s API.')
            .addToggle(toggle => 
                toggle
                    .setValue(this.plugin.settings.useCustomBaseUrl)
                    .onChange(async (value) => {
                        this.plugin.settings.useCustomBaseUrl = value;
                        await this.plugin.saveSettings();
                    })
            )
            .addText(text =>
                text
                    .setPlaceholder('http://localhost:11434')
                    .setValue(this.plugin.settings.customBaseUrl)
                    // Update the settings object whenever the value of the text field changes, and then save it to disk:
                    .onChange(async (value) => {
                        this.plugin.settings.customBaseUrl = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerElement)
            .setName('Language')
            .setDesc('The language to generate tags in')
            .addText(text =>
                text
                    .setValue(this.plugin.settings.language)
                    .onChange(async (value) => {
                        this.plugin.settings.language = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerElement)
            .setName('Lowercase Mode')
            .setDesc('If enabled all tags will be generated with lowercase characters.')
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.lowerCaseMode)
                    .onChange(async (value) => {
                        this.plugin.settings.lowerCaseMode = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }
}