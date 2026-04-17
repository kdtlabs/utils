import type { Replacer } from './types'

export const trimmedBoundaryReplacer: Replacer = {
    name: 'trimmed-boundary',

    replace(source, search, replacement) {
        const trimmed = search.trim()
        const index = source.indexOf(trimmed)

        if (index === -1) {
            return null
        }

        return source.slice(0, index) + replacement + source.slice(index + trimmed.length)
    },
}
