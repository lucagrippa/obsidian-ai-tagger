import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { AiTaggerSettingTab } from "./settings";
import { LLM } from "./llm";

// Remember to rename these classes and interfaces!

// my settings definition
// this tells me what settings I want the user to be able to configure
// while the plugin is enabled you can access these settings from the settings member variable
interface AiTaggerSettings {
	openai_api_key: string;
	model: string;
}

// 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
const DEFAULT_SETTINGS: Partial<AiTaggerSettings> = {
	openai_api_key: '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',
	model: 'gpt-3.5'
}


export default class AiTagger extends Plugin {
	settings: AiTaggerSettings;
	llm: LLM;

	// this function retrieves data from disk
	async loadSettings() {
		// Object.assign() is a JavaScript function that copies all properties from one object to another. 
		// Any properties that are returned by loadData() override the properties in DEFAULT_SETTINGS.
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	// this function retrieves store data on the disk
	async saveSettings() {
		// loadData() and saveData() provide an easy way to store and retrieve data from disk.
		await this.saveData(this.settings);
		this.llm = new LLM(this.settings.model, this.settings.openai_api_key);
	}


	async onload() {
		// load settings on plugin load
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AiTaggerSettingTab(this.app, this));

		// instantiate LLM class
		this.llm = new LLM(this.settings.model, this.settings.openai_api_key);

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('wand-2', 'Generate tags!', async () => {
			// Called when the user clicks the icon.
			// const { editor: Editor } = this.app.workspace.getActiveViewOfType(MarkdownView);
			const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (markdownView) {
				try {
					const value = markdownView.editor.getValue();

					const response = await this.llm.generateTags(value);

					// write the responses to the top of the document in the editor
					markdownView.editor.replaceRange(response, { line: 0, ch: 0 });
				} catch (error) {
					new Notice(error.message);
					console.error('Error while generating tags:', error);
				}
			}
		});


		// this adds an editor command that can generate tags for the current selection
		this.addCommand({
			id: 'generate-tags',
			name: 'Generate tags',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				try {
					let selection = editor.getSelection();

					if (selection === "") {
						// if selection is empty, use the entire document
						selection = editor.getValue();
					}

					const response = await this.llm.generateTags(selection);

					// write the responses to the top of the document in the editor
					editor.replaceRange(response, { line: 0, ch: 0 });
				} catch (error) {
					new Notice(error.message);
					console.error('Error while generating tags:', error);
				}
			}
		});
	}

	onunload() {

	}
}


