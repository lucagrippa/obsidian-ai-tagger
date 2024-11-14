import { Editor, FrontMatterInfo, MarkdownView, Notice, Plugin, Workspace, TFile, Vault, getFrontMatterInfo, TFolder, TAbstractFile, parseFrontMatterTags } from 'obsidian';

import { LLM } from "./llm";
import { ModelService } from './model-service';
import { AiTaggerSettings } from "./settings";
import { AiTaggerSettingTab } from "./settings-tab";
import { convertTagsToLowerCase } from "./utils";

const DEFAULT_SETTINGS: Partial<AiTaggerSettings> = {
	model: 'gpt-4o-mini',
	lowerCaseMode: false
}

export default class AiTagger extends Plugin {
	settings: AiTaggerSettings;
	llm: LLM | null = null;

	async initializeLlm() {
		// Get model configuration
		const settings = this.settings;
		const modelConfig = ModelService.getModelById(settings.model);
		const apiKey = ModelService.getApiKey(settings, modelConfig.provider);

		// Validate API key existence
		if ((!apiKey || typeof apiKey !== "string") && modelConfig.provider !== "ollama") {
			new Notice(`Please set your ${modelConfig.company} API key in the plugin settings.`);
			throw new Error(`Please set your ${modelConfig.company} API key in the plugin settings.`);
		}

		// Validate API key format
		if (!ModelService.validateApiKey(apiKey, modelConfig.provider)) {
			new Notice(`Invalid ${modelConfig.company} API key format.`);
			throw new Error(`Invalid ${modelConfig.company} API key format.`);
		}

		try {
			this.llm = await LLM.initialize(
				settings.model,
				apiKey,
				this,
				settings.useCustomBaseUrl ? settings.customBaseUrl : null
			);
		} catch (error) {
			new Notice(`Failed to initialize ${modelConfig.company} model: ${error.message}`);
			throw new Error(`Failed to initialize ${modelConfig.company} model: ${error.message}`);
		}
	}

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
		// Reinitialize LLM when settings change
		await this.initializeLlm();
	}

	async tagText(currentFile: TFile, text: string) {
		// notify user that we are generating tags
		new Notice("Generating tags...");
		console.info("Generating tags...");

		// contentStart will return 0 if the text does not include frontmatter
		let { contentStart }: FrontMatterInfo = getFrontMatterInfo(text);

		// get contents of document excluding frontmatter
		let content: string = text.substring(contentStart);
		console.debug("Content:", content.substring(0, 30) + "...")

		try {
			if (!this.llm) {
				await this.initializeLlm();
			}

			// Get existing tags using parseFrontMatterTags
			const existingTags: string[] = parseFrontMatterTags(this.app.metadataCache.getFileCache(currentFile)?.frontmatter) || [];
			console.debug("Existing Tags:", existingTags);

			// generate tags for the document using an LLM
			let generatedTags: string[] = await this.llm!.generateTags(content, existingTags);
			// const generatedTags: string[] = ["#tag1", "#tag2"];
			console.debug("Generated Tags:", generatedTags);

			if (this.settings.lowerCaseMode === true) {
				generatedTags = convertTagsToLowerCase(generatedTags);
			}

			// update frontmatter with generated tags
			this.app.fileManager.processFrontMatter(currentFile, frontmatter => {
				if (!frontmatter["tags"]) {
					frontmatter["tags"] = generatedTags;
				} else {
					frontmatter["tags"].push(...generatedTags)
				}
			});
		} catch (error) {
			console.error('Error in tagText():', error);
			new Notice(error.message);
		}
	}

	async tagFileOrFolder(abstractFile: TAbstractFile) {
		if (abstractFile instanceof TFile) {
			const fileContents = await abstractFile.vault.read(abstractFile);
			await this.tagText(abstractFile, fileContents);
		} else if (abstractFile instanceof TFolder) {
			for (const child of abstractFile.children) {
				await this.tagFileOrFolder(child);
			}
		}
	}

	async onload() {
		// load settings on plugin load
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AiTaggerSettingTab(this.app, this));

		// initialize LLM
		await this.initializeLlm();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('wand-2', 'Generate tags!', async () => {
			// Called when the user clicks the icon.

			try {
				const workspace: Workspace = this.app.workspace
				const markdownView: MarkdownView | null = workspace.getActiveViewOfType(MarkdownView);
				const currentFile: TFile | null = workspace.getActiveFile();
				if (markdownView !== null && currentFile !== null) {
					// get current document as a string
					let fileContents: string = markdownView.editor.getValue();
					this.tagText(currentFile, fileContents);
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
					// get current selection as a string
					let selection: string = editor.getSelection();
					const currentFile: TFile | null = this.app.workspace.getActiveFile();

					if (currentFile !== null) {
						if (selection === "") {
							// if selection is empty, use the entire document
							let fileContents: string = editor.getValue();
							this.tagText(currentFile, fileContents);
						} else {
							this.tagText(currentFile, selection);
						}
					}
				} catch (error) {
					new Notice(error.message);
					console.error('Error while generating tags:', error);
				}
			}
		});

		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file, source, leaf) => {
				menu.addItem((item) => {
					item
						.setTitle('Generate tags 🪄')
						.setIcon('wand-2')
						.onClick(async () => {
							await this.tagFileOrFolder(file);
						});
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on('files-menu', (menu, files, source, leaf) => {
				menu.addItem((item) => {
					item
						.setTitle('Generate tags 🪄')
						.setIcon('wand-2')
						.onClick(async () => {
							for (const file of files) {
								await this.tagFileOrFolder(file);
							}
						});
				});
			})
		);
	}

	onunload() {

	}
}


