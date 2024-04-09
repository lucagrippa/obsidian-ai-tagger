import { getAllTags } from 'obsidian';

export function getVaultTags() {
    const tagsSet = new Set(); // Use a set to ensure unique tags

    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
        const cache = this.app.metadataCache.getFileCache(file)
        const tags = getAllTags(cache);
        if (tags !== null) {
            for (const tag of tags) {
                tagsSet.add(tag);
            }
        }
    }

    return tagsSet;
}