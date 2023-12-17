import { App, Editor, MarkdownView, Modal, Menu, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { AiPluginSettingTab } from "./settings";
import { LLM } from "./llm";
import { get } from 'http';
// Remember to rename these classes and interfaces!

// my settings definition
// this tells me what settings I want the user to be able to configure
// while the plugin is enabled you can access these settings from the settings member variable
interface AiPluginSettings {
	openai_api_key: string;
	model: string;
}

// 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
const DEFAULT_SETTINGS: Partial<AiPluginSettings> = {
	openai_api_key: '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',
	model: 'gpt-3.5'
}


export default class AiPlugin extends Plugin {
	settings: AiPluginSettings;

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

	
	async onload() {
		// load settings on plugin load
		await this.loadSettings();
		console.log(this.settings)

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new AiPluginSettingTab(this.app, this));

		// instantiate LLM class
		// const llm = new LLM(this.settings.model, this.settings.openai_api_key);

		// // this adds an editor command that can translate the current selection
		// this.addCommand({
		// 	id: 'generate-tags',
		// 	name: 'Generate Tags',
		// 	editorCallback: async (editor: Editor, view: MarkdownView) => {
		// 		try {
		// 			// console.log(editor.getSelection());
		// 			// let selection = editor.getSelection();

		// 			// // check if selection is empty and return a notice if it is
		// 			// if (selection === "") {
		// 			// 	new Notice("Please select some text to generate tags for.");
		// 			// 	return;
		// 			// }

		// 			let value = editor.getValue();
		// 			console.log(value);
		// 			let response = await llm.createTags(value);
		// 			// editor.replaceSelection(response);
		// 			// write the responses to the top of the document in the editor
		// 			editor.replaceRange(response, { line: 0, ch: 0 });
		// 		} catch (error) {
		// 			console.error('Error while generating:', error);
		// 		}
		// 	}
		// });

		// // This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('wand-2', 'Generate tags!', async (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	// const { editor: Editor } = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 	const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 	if (markdownView) {
		// 		try {
		// 			let value = markdownView.editor.getValue();
		// 			console.log(value);
		// 			let response = await llm.createTags(value);
		// 			markdownView.editor.replaceRange(response, { line: 0, ch: 0 });
		// 		} catch (error) {
		// 			console.error('Error while generating:', error);
		// 		}
		// 	}
		// });

		// this.registerEvent(
		// 	this.app.workspace.on("file-menu", (menu, file) => {
		// 		menu.addItem((item) => {
		// 			item
		// 				.setTitle("Print file path 👈")
		// 				.setIcon("document")
		// 				.onClick(async () => {
		// 					new Notice(file.path);
		// 				});
		// 		});
		// 	})
		// );

		// this.registerEvent(
		// 	this.app.workspace.on("editor-menu", (menu, editor, view) => {
		// 		menu.addItem((item) => {
		// 			item
		// 				.setTitle("Print file path 👈")
		// 				.setIcon("document")
		// 				.onClick(async () => {
		// 					new Notice(view.file.path);
		// 				});
		// 		});
		// 	})
		// );

		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		let selection = editor.getSelection();
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });


		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this registers a function to run continuously every 5 minutes
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}


