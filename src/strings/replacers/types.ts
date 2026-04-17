export interface Replacer {
    name: string
    replace(source: string, search: string, replacement: string): string | null
}

export interface ReplaceWithFallbackResult {
    result: string
    strategy: string
}
