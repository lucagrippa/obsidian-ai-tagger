import { Editor, MarkdownView, Notice, Plugin, getFrontMatterInfo } from 'obsidian';
import { AiTaggerSettingTab } from "./settings";
import { LLM } from "./llm";
import * as yaml from "js-yaml";

// my settings definition
// this tells me what settings I want the user to be able to configure
// while the plugin is enabled you can access these settings from the settings member variable
interface AiTaggerSettings {
	openAIApiKey: string;
	groqApiKey: string;
	model: string;
	custom_base_url: string;
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

	async tagDocument(documentContents: string, editor: Editor, llm: LLM) {
		let { contentStart, exists, from, frontmatter, to } = getFrontMatterInfo(documentContents);

		let content: string = documentContents.substring(contentStart);
		console.log("Content:", content.substring(0, 30) + "...")

		try {
			// generate tags for the document using an LLM
			const generatedTags: string = await llm.generateTags(content);
			console.log("Generated Tags:", generatedTags)

			if (exists) {
				let yamlFrontMatter = yaml.load(frontmatter);

				// Update existing "tags" property with generated tags
				if (yamlFrontMatter.tags === undefined) {
					yamlFrontMatter.tags = generatedTags;
				} else {
					yamlFrontMatter.tags = yamlFrontMatter.tags + " " + generatedTags;
				}

				// write the frontmatter to the top of the document in the editor
				const updatedFrontMatter = yaml.dump(yamlFrontMatter);
				editor.replaceRange(
					updatedFrontMatter,
					editor.offsetToPos(from),
					editor.offsetToPos(to)
				);
			} else {
				// create front matter
				const newFrontmatter = `---\ntags: ${generatedTags}\n---\n`
				// write the frontmatter to the top of the document in the editor
				editor.replaceRange(newFrontmatter, { line: 0, ch: 0 });
			}
		} catch (error) {
			new Notice(error.message);
			console.error('Error while generating tags:', error);
		}
	}

	async tagSelection(selection: string, editor: Editor, llm: LLM) {
		let { contentStart, exists, from, frontmatter, to } = getFrontMatterInfo(selection);

		let content: string = selection.substring(contentStart);
		console.log("Content:", content.substring(0, 30) + "...")

		try {
			// generate tags for the document using an LLM
			const generatedTags: string = await llm.generateTags(content);
			console.log("Generated Tags:", generatedTags)

			if (exists) {
				let yamlFrontMatter = yaml.load(frontmatter);

				// Update existing "tags" property with generated tags
				if (yamlFrontMatter.tags === undefined) {
					yamlFrontMatter.tags = generatedTags;
				} else {
					yamlFrontMatter.tags = yamlFrontMatter.tags + " " + generatedTags;
				}

				// write the frontmatter to the top of the document in the editor
				const updatedFrontMatter = yaml.dump(yamlFrontMatter);
				editor.replaceRange(
					updatedFrontMatter,
					editor.offsetToPos(from),
					editor.offsetToPos(to)
				);
			} else {
				// check to see if this is a selection that doesn't include the frontmatter of the document
				// if so, we don't need to create new frontmatter we just need to add the tags to the current frontmatter
				console.log("Selection with no frontmatter:", selection.substring(0, 30) + "...")
				let fileContents: string = editor.getValue();
				console.log("File Contents:", fileContents.substring(0, 30) + "...")
				let { contentStart, exists, from, frontmatter, to } = getFrontMatterInfo(fileContents);

				// if there is frontmatter, we need to add it
				if (exists) {
					let yamlFrontMatter = yaml.load(frontmatter);
					console.log("Overall document has frontmatter:", yamlFrontMatter)

					// Update existing "tags" property with generated tags
					if (yamlFrontMatter.tags === undefined) {
						yamlFrontMatter.tags = generatedTags;
					} else {
						yamlFrontMatter.tags = yamlFrontMatter.tags + " " + generatedTags;
					}

					// write the frontmatter to the top of the document in the editor
					const updatedFrontMatter = yaml.dump(yamlFrontMatter);
					editor.replaceRange(
						updatedFrontMatter,
						editor.offsetToPos(from),
						editor.offsetToPos(to)
					);
				} else {
					console.log("Overall document doesn't have frontmatter:")
					// create front matter
					const newFrontmatter = `---\ntags: ${generatedTags}\n---\n`
					// write the frontmatter to the top of the document in the editor
					editor.replaceRange(newFrontmatter, { line: 0, ch: 0 });
				}
			}
		} catch (error) {
			new Notice(error.message);
			console.error('Error while generating tags:', error);
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
			console.log("Groq API key: ", this.settings.groqApiKey)

			// check if model contains "OpenAI" and API key is not empty and then check if model contains "Groq" and API key is not empty
			if ((this.settings.model.includes("gpt-4") || this.settings.model.includes("gpt-3.5-turbo")) && (this.settings.openAIApiKey === "" || this.settings.openAIApiKey === undefined || this.settings.openAIApiKey === null)) {
				new Notice("Please set your OpenAI API key in the plugin settings.");
				return;
			} else if ((this.settings.model.includes("llama2-70b-4096") || this.settings.model.includes("mixtral-8x7b-32768") || this.settings.model.includes("gemma-7b-it")) && (this.settings.groqApiKey === "" || this.settings.groqApiKey === undefined || this.settings.groqApiKey === null)) {
				new Notice("Please set your Groq API key in the plugin settings.");
				return;
			}

			try {
				// print custom base url and type 
				// console.log("Custom Base URL:", this.settings.custom_base_url)
				// console.log("Type of Custom Base URL:", typeof this.settings.custom_base_url)

				// instantiate LLM class
				let llm = new LLM(this.settings.model, this.settings.openAIApiKey, this.settings.groqApiKey, this.settings.custom_base_url);

				// Called when the user clicks the icon.
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// get current document as a string
					let fileContents: string = markdownView.editor.getValue();
					this.tagDocument(fileContents, markdownView.editor, llm);
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
				// check if model contains "OpenAI" and API key is not empty and then check if model contains "Groq" and API key is not empty
				if ((this.settings.model.includes("gpt-4") || this.settings.model.includes("gpt-3.5-turbo")) && (this.settings.openAIApiKey === "" || this.settings.openAIApiKey === undefined || this.settings.openAIApiKey === null)) {
					new Notice("Please set your OpenAI API key in the plugin settings.");
					return;
				} else if ((this.settings.model.includes("mistral") || this.settings.model.includes("mixtral")) && (this.settings.groqApiKey === "" || this.settings.groqApiKey === undefined || this.settings.groqApiKey === null)) {
					new Notice("Please set your Groq API key in the plugin settings.");
					return;
				}

				try {
					// instantiate LLM class
					let llm = new LLM(this.settings.model, this.settings.openAIApiKey, this.settings.groqApiKey, this.settings.custom_base_url);

					// get current selection as a string
					let selection = editor.getSelection();

					if (selection === "") {
						// if selection is empty, use the entire document
						let fileContents: string = editor.getValue();
						this.tagDocument(fileContents, editor, llm);
					} else {
						this.tagSelection(selection, editor, llm);
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


