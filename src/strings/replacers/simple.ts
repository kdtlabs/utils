import type { Replacer } from './types'

export const simpleReplacer: Replacer = {
    name: 'simple',

    replace(source, search, replacement) {
        const index = source.indexOf(search)

        if (index === -1) {
            return null
        }

        return source.slice(0, index) + replacement + source.slice(index + search.length)
    },
}
