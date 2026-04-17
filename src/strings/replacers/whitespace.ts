import type { Replacer } from './types'
import { createSafeRegex } from '../create-safe-regex'
import { escapeRegExp } from '../manipulations'

export const whitespaceReplacer: Replacer = {
    name: 'whitespace',

    replace(source, search, replacement) {
        const pattern = search.replaceAll(
            /(?<ws>\s+)|(?<nonWs>\S+)/gu,
            (_m, ws: string | undefined, nonWs: string | undefined) => (ws ? String.raw`\s+` : escapeRegExp(nonWs!)),
        )

        const re = createSafeRegex(pattern, 'u')
        const match = re.exec(source)

        if (!match) {
            return null
        }

        return source.slice(0, match.index) + replacement + source.slice(match.index + match[0].length)
    },
}
