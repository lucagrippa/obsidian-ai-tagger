// my settings definition
// this tells me what settings I want the user to be able to configure
// while the plugin is enabled you can access these settings from the settings member variable
export interface AiTaggerSettings {
	openaiApiKey: string;
	mistralaiApiKey: string;
	anthropicApiKey: string;
	groqApiKey: string;
	ollamaApiKey: string;
	model: string;
	useCustomBaseUrl: boolean;
	customBaseUrl: string;
	lowerCaseMode: boolean;
	[key: `${string}ApiKey`]: string;
}