import type { Replacer } from './types'

const ESCAPE_MAP: Record<string, string> = {
    'n': '\n',
    't': '\t',
    'r': '\r',
    '"': '"',
    '\'': '\'',
    '\\': '\\',
}

function unescape(input: string) {
    const len = input.length

    let result = ''
    let i = 0

    while (i < len) {
        if (input[i] === '\\' && i + 1 < len) {
            const mapped = ESCAPE_MAP[input[i + 1]!]

            if (mapped !== undefined) {
                result += mapped
                i += 2
                continue
            }
        }

        result += input[i]!
        i++
    }

    return result
}

export const escapeReplacer: Replacer = {
    name: 'escape',

    replace(source, search, replacement) {
        const unescaped = unescape(search)
        const index = source.indexOf(unescaped)

        if (index === -1) {
            return null
        }

        return source.slice(0, index) + replacement + source.slice(index + unescaped.length)
    },
}
