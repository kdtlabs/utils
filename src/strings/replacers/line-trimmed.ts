import type { Replacer } from './types'

export const lineTrimmedReplacer: Replacer = {
    name: 'line-trimmed',

    replace(source, search, replacement) {
        const sourceLines = source.split('\n')
        const searchLines = search.split('\n')
        const trimmedSearch = searchLines.map((l) => l.trim())
        const sLen = sourceLines.length
        const nLen = searchLines.length

        for (let i = 0; i <= sLen - nLen; i++) {
            let ok = true

            for (let k = 0; k < nLen; k++) {
                if (sourceLines[i + k]!.trim() !== trimmedSearch[k]) {
                    ok = false
                    break
                }
            }

            if (ok) {
                const before = sourceLines.slice(0, i)
                const after = sourceLines.slice(i + nLen)

                return [...before, replacement, ...after].join('\n')
            }
        }

        return null
    },
}
