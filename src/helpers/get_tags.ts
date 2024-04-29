import { getAllTags, TFile, CachedMetadata} from 'obsidian';

export function getVaultTags(): Array<string> {
    const tagsSet: Set<string> = new Set(); // Use a set to ensure unique tags

    const files: Array<TFile> = this.app.vault.getMarkdownFiles();
    // get tags for each file
    files.forEach((file: TFile) => {
        const cache: CachedMetadata | null = this.app.metadataCache.getFileCache(file);
        if (cache !== null) {
            const tags: Array<string> | null = getAllTags(cache);

            if (tags !== null) {
                tags.forEach((tag) => tagsSet.add(tag));
            }
        }
    })

    const uniqueTagsArray: Array<string> = [...tagsSet];

    return uniqueTagsArray;
}

export function getTagsString(): string {
    // get every tag in the current vault
    const vaultTags: Array<string> = getVaultTags()
    console.log("All Vault Tags: ", vaultTags.length)

    // create a string of the first 100 tags to insert into the prompt
    const tagsString: string = vaultTags.slice(0, 100).map(tag => `- ${tag}`).join("\n");

    return tagsString
}