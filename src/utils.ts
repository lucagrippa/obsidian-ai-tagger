import { getAllTags, TFile, CachedMetadata } from 'obsidian';

export function getVaultTags(): string[] {
    const tagsSet: Set<string> = new Set(); // Use a set to ensure unique tags

    const files: TFile[] = this.app.vault.getMarkdownFiles();
    // get tags for each file
    files.forEach((file: TFile) => {
        const cache: CachedMetadata | null = this.app.metadataCache.getFileCache(file);
        if (cache !== null) {
            const tags: string[] | null = getAllTags(cache);

            if (tags !== null) {
                tags.forEach((tag) => tagsSet.add(tag));
            }
        }
    })

    const uniqueTagsArray: string[] = [...tagsSet];

    return uniqueTagsArray;
}

export function getTagsString(existingTags: string[]): string {
    // get every tag in the current vault
    const vaultTags: string[] = getVaultTags()
    console.log("All Vault Tags: ", vaultTags.length)

    // remove existing tags from vault tags
    const filteredVaultTags = vaultTags.filter(tag =>
        !existingTags.some(existingTag =>
            existingTag.toLowerCase() === tag.toLowerCase()
        )
    )

    // create a string of the first 100 tags to insert into the prompt
    const tagsString: string = filteredVaultTags.slice(0, 100).map(tag => `- ${tag}`).join("\n");

    return tagsString
}

export function convertTagsToLowerCase(tags: string[]): string[] {
    return tags.map(tag => tag.toLowerCase());
}