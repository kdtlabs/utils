import type { Replacer } from './types'

function commonLeadingWhitespace(lines: readonly string[]) {
    let prefix: string | null = null

    for (const line of lines) {
        if (line.length === 0) {
            continue
        }

        let end = 0

        while (end < line.length && (line[end] === ' ' || line[end] === '\t')) {
            end++
        }

        if (end === line.length) {
            continue
        }

        const leading = line.slice(0, end)

        if (prefix === null) {
            prefix = leading
            continue
        }

        let i = 0

        while (i < prefix.length && i < leading.length && prefix[i] === leading[i]) {
            i++
        }

        prefix = prefix.slice(0, i)

        if (prefix === '') {
            break
        }
    }

    return prefix ?? ''
}

function stripCommonIndent(lines: readonly string[], indent: string) {
    if (indent === '') {
        return lines
    }

    return lines.map((line) => (line.startsWith(indent) ? line.slice(indent.length) : line))
}

export const indentationReplacer: Replacer = {
    name: 'indentation',

    replace(source, search, replacement) {
        const sourceLines = source.split('\n')
        const searchLines = search.split('\n')
        const searchIndent = commonLeadingWhitespace(searchLines)
        const strippedSearch = stripCommonIndent(searchLines, searchIndent)
        const sLen = sourceLines.length
        const nLen = searchLines.length

        for (let i = 0; i <= sLen - nLen; i++) {
            const windowLines = sourceLines.slice(i, i + nLen)
            const windowIndent = commonLeadingWhitespace(windowLines)
            const strippedWindow = stripCommonIndent(windowLines, windowIndent)

            let ok = true

            for (let k = 0; k < nLen; k++) {
                if (strippedWindow[k] !== strippedSearch[k]) {
                    ok = false
                    break
                }
            }

            if (ok) {
                const replacementLines = replacement.split('\n')
                const reindented = replacementLines.map((line) => (line === '' ? '' : windowIndent + line))
                const before = sourceLines.slice(0, i)
                const after = sourceLines.slice(i + nLen)

                return [...before, ...reindented, ...after].join('\n')
            }
        }

        return null
    },
}
