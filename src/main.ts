import { Editor, FrontMatterInfo, MarkdownView, Notice, Plugin, Workspace, TFile, Vault, getFrontMatterInfo } from 'obsidian';

import { AiTaggerSettingTab } from "./settings";
import { LLM } from "./llms/base";
import { getLlm } from './helpers/get_model';

// my settings definition
// this tells me what settings I want the user to be able to configure
// while the plugin is enabled you can access these settings from the settings member variable
export interface AiTaggerSettings {
	openAIApiKey: string;
	mistralAIApiKey: string;
	model: string;
	custom_base_url: string;
	lowerCaseMode: boolean;
}

const DEFAULT_SETTINGS: Partial<AiTaggerSettings> = {
	model: 'gpt-3.5-turbo'
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
	}

	async tagText(currentFile: TFile, text: string, llm: LLM) {
		// contentStart will return 0 if the text does not include frontmatter
		let { contentStart }: FrontMatterInfo = getFrontMatterInfo(text);

		// get contents of document excluding frontmatter
		let content: string = text.substring(contentStart);
		console.debug("Content:", content.substring(0, 30) + "...")

		try {
			// notify user that we are generating tags
			new Notice("Generating tags...");
			console.info("Generating tags...");

			// generate tags for the document using an LLM
			let generatedTags: Array<string> = await llm.generateTags(content);
			// const generatedTags: Array<string> = ["#tag1", "#tag2"];
			console.debug("Generated Tags:", generatedTags);

			if (this.settings.lowerCaseMode === true) {
				for (let i = 0; i < generatedTags.length; i++) {
					generatedTags[i] = generatedTags[i].toLowerCase()
				}
			}

			this.app.fileManager.processFrontMatter(currentFile, frontmatter => {
				if (!frontmatter['tags']) {
					frontmatter['tags'] = generatedTags;
				} else {
					frontmatter['tags'].push(...generatedTags)
				}
			});
		} catch (error) {
			console.error('Error in tagText():', error);
			new Notice(error.message);
		}
	}

	async onload() {
		// load settings on plugin load
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AiTaggerSettingTab(this.app, this));

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('wand-2', 'Generate tags!', async () => {
			console.log("Model: ", this.settings.model)
			console.log("OpenAI API key: ", this.settings.openAIApiKey)
			console.log("Mistral AI API key: ", this.settings.mistralAIApiKey)

			try {
				// check if model contains "OpenAI" and API key is not empty and then check if model contains "Mistral AI" and API key is not empty
				// instantiate LLM class
				let llm: LLM = getLlm(this.settings);

				// Called when the user clicks the icon.
				const workspace: Workspace = this.app.workspace
				const markdownView: MarkdownView | null = workspace.getActiveViewOfType(MarkdownView);
				const currentFile: TFile | null = workspace.getActiveFile();
				if (markdownView !== null && currentFile !== null) {
					// get current document as a string
					let fileContents: string = markdownView.editor.getValue();
					this.tagText(currentFile, fileContents, llm);
				} else {
					const message = "Open and select a document to use the AI Tagger"
					new Notice(message);
					console.info(message);
				}
			} catch (error) {
				new Notice(error.message);
				console.error('Error while generating tags:', error);
			}
		});


		// this adds an editor command that can generate tags for the current selection
		this.addCommand({
			id: 'generate-tags',
			name: 'Generate tags',
			editorCallback: async (editor: Editor, view: MarkdownView) => {

				try {
					// check if model contains "OpenAI" and API key is not empty and then check if model contains "Mistral AI" and API key is not empty
					// instantiate LLM class
					let llm: LLM = getLlm(this.settings);

					// get current selection as a string
					let selection: string = editor.getSelection();
					const currentFile: TFile | null = this.app.workspace.getActiveFile();

					if (currentFile !== null) {
						if (selection === "") {
							// if selection is empty, use the entire document
							let fileContents: string = editor.getValue();
							this.tagText(currentFile, fileContents, llm);
						} else {
							this.tagText(currentFile, selection, llm);
						}
					}
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


