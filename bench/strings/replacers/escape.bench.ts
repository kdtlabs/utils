import { bench, do_not_optimize, run, summary } from 'mitata'

// Approach A: char-by-char single pass
function charByChar(input: string) {
    const len = input.length

    let result = ''
    let i = 0

    while (i < len) {
        if (input[i] === '\\' && i + 1 < len) {
            const next = input[i + 1]!

            switch (next) {
                case 'n': {
                    result += '\n'
                    i += 2
                    continue
                }

                case 't': {
                    result += '\t'
                    i += 2
                    continue
                }

                case 'r': {
                    result += '\r'
                    i += 2
                    continue
                }

                case '"': {
                    result += '"'
                    i += 2
                    continue
                }

                case "'": {
                    result += "'"
                    i += 2
                    continue
                }

                case '\\': {
                    result += '\\'
                    i += 2
                    continue
                }

                default: {
                    break
                }
            }
        }

        result += input[i]
        i++
    }

    return result
}

// Approach B: multi replaceAll chain
function replaceAllChain(input: string) {
    return input
        .replaceAll('\\n', '\n')
        .replaceAll('\\t', '\t')
        .replaceAll('\\r', '\r')
        .replaceAll('\\"', '"')
        .replaceAll("\\'", "'")
        .replaceAll('\\\\', '\\')
}

// Approach C: single regex replace
const ESCAPE_RE = /\\([ntr"'\\])/gu
const ESCAPE_MAP: Record<string, string> = { n: '\n', t: '\t', r: '\r', '"': '"', "'": "'", '\\': '\\' }

function regexReplace(input: string) {
    return input.replace(ESCAPE_RE, (_m, c: string) => ESCAPE_MAP[c] ?? c)
}

const short = String.raw`hello\nworld`
const medium = String.raw`line1\nline2\tindented\r\n\"quoted\" and \\backslash\nend`
const noEscapes = 'a plain string with no escape sequences at all'

summary(() => {
    bench('charByChar / short', () => do_not_optimize(charByChar(short)))
    bench('replaceAllChain / short', () => do_not_optimize(replaceAllChain(short)))
    bench('regexReplace / short', () => do_not_optimize(regexReplace(short)))
})

summary(() => {
    bench('charByChar / medium', () => do_not_optimize(charByChar(medium)))
    bench('replaceAllChain / medium', () => do_not_optimize(replaceAllChain(medium)))
    bench('regexReplace / medium', () => do_not_optimize(regexReplace(medium)))
})

summary(() => {
    bench('charByChar / noEscapes', () => do_not_optimize(charByChar(noEscapes)))
    bench('replaceAllChain / noEscapes', () => do_not_optimize(replaceAllChain(noEscapes)))
    bench('regexReplace / noEscapes', () => do_not_optimize(regexReplace(noEscapes)))
})

await run()
