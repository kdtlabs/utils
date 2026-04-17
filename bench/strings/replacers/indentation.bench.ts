import { bench, do_not_optimize, run, summary } from 'mitata'

function commonLeadingWsCharLoop(lines: readonly string[]) {
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

function commonLeadingWsRegex(lines: readonly string[]) {
    const indentRe = /^[\t ]*/u
    const blankRe = /^\s*$/u

    let prefix: string | null = null

    for (const line of lines) {
        if (line === '' || blankRe.test(line)) {
            continue
        }

        const leading = indentRe.exec(line)![0]

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

const lines = [
    '    if (x) {',
    '        const y = 1',
    '        return y',
    '    }',
    '',
    '    return 0',
]

summary(() => {
    bench('charLoop', () => do_not_optimize(commonLeadingWsCharLoop(lines)))
    bench('regex', () => do_not_optimize(commonLeadingWsRegex(lines)))
})

await run()
