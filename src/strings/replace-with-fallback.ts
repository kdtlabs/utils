import type { Replacer, ReplaceWithFallbackResult } from './replacers/types'
import { escapeReplacer } from './replacers/escape'
import { indentationReplacer } from './replacers/indentation'
import { lineTrimmedReplacer } from './replacers/line-trimmed'
import { simpleReplacer } from './replacers/simple'
import { trimmedBoundaryReplacer } from './replacers/trimmed-boundary'
import { whitespaceReplacer } from './replacers/whitespace'

export const DEFAULT_REPLACERS: readonly Replacer[] = [
    simpleReplacer,
    lineTrimmedReplacer,
    trimmedBoundaryReplacer,
    indentationReplacer,
    whitespaceReplacer,
    escapeReplacer,
]

export function replaceWithFallback(source: string, search: string, replacement: string, replacers: readonly Replacer[] = DEFAULT_REPLACERS): ReplaceWithFallbackResult {
    if (search === '') {
        throw new TypeError('search cannot be empty')
    }

    if (search === replacement) {
        return { result: source, strategy: 'simple' }
    }

    for (const replacer of replacers) {
        const result = replacer.replace(source, search, replacement)

        if (result !== null) {
            return { result, strategy: replacer.name }
        }
    }

    throw new Error(`No replacer matched for search: ${JSON.stringify(search.slice(0, 80))}`)
}
