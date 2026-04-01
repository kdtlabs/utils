import { bench, do_not_optimize, run, summary } from 'mitata'

// ─── Approaches ─────────────────────────────────────────────────────────────

// Approach A: split + detect min indent + map strip + join
function splitDetectStrip(str: string) {
    const lines = str.split('\n')

    // Remove leading/trailing empty lines
    while (lines.length > 0 && lines[0]!.trim() === '') {
        lines.shift()
    }

    while (lines.length > 0 && lines[lines.length - 1]!.trim() === '') {
        lines.pop()
    }

    let minIndent = Infinity

    for (const line of lines) {
        if (line.trim() === '') {
            continue
        }

        const match = line.match(/^(\s*)/)

        if (match) {
            minIndent = Math.min(minIndent, match[1]!.length)
        }
    }

    if (minIndent === Infinity || minIndent === 0) {
        return lines.join('\n')
    }

    return lines.map((line) => line.slice(minIndent)).join('\n')
}

// Approach B: regex to detect indent + replaceAll
function regexDetectReplace(str: string) {
    // Remove leading/trailing empty lines
    str = str.replace(/^\s*\n/, '').replace(/\n\s*$/, '')

    const match = str.match(/^[ \t]*(?=\S)/gm)

    if (!match) {
        return str
    }

    let minIndent = Infinity

    for (const m of match) {
        minIndent = Math.min(minIndent, m.length)
    }

    if (minIndent === 0) {
        return str
    }

    return str.replaceAll(new RegExp(`^[ \\t]{${minIndent}}`, 'gm'), '')
}

// Approach C: Manual char iteration — scan for min indent without splitting
function manualScan(str: string) {
    const len = str.length

    // Find start (skip leading empty lines)
    let start = 0

    while (start < len) {
        const ch = str.charCodeAt(start)

        if (ch === 0x0A) {
            start++
            continue
        }

        if (ch === 0x20 || ch === 0x09 || ch === 0x0D) {
            // Check if entire line is whitespace
            let j = start

            while (j < len && str.charCodeAt(j) !== 0x0A) {
                j++
            }

            const lineContent = str.slice(start, j).trim()

            if (lineContent === '') {
                start = j + 1
                continue
            }
        }

        break
    }

    // Find end (skip trailing empty lines)
    let end = len

    while (end > start) {
        const ch = str.charCodeAt(end - 1)

        if (ch === 0x0A || ch === 0x20 || ch === 0x09 || ch === 0x0D) {
            end--
            continue
        }

        break
    }

    // Find end of last non-empty content line
    while (end < len && str.charCodeAt(end) !== 0x0A) {
        end++
    }

    if (start >= end) {
        return ''
    }

    str = str.slice(start, end)

    // Now split and process
    const lines = str.split('\n')

    let minIndent = Infinity

    for (const line of lines) {
        if (line.trim() === '') {
            continue
        }

        let indent = 0

        while (indent < line.length && (line.charCodeAt(indent) === 0x20 || line.charCodeAt(indent) === 0x09)) {
            indent++
        }

        minIndent = Math.min(minIndent, indent)
    }

    if (minIndent === Infinity || minIndent === 0) {
        return lines.join('\n')
    }

    return lines.map((line) => line.slice(minIndent)).join('\n')
}

// ─── Datasets ───────────────────────────────────────────────────────────────

const simple = `
    line 1
    line 2
    line 3
`

const mixed = `
    line 1
      line 2
    line 3
`

const noIndent = `
line 1
line 2
line 3
`

const singleLine = '    hello'
const empty = ''

const large = '\n' + Array.from({ length: 100 }, (_, i) => `        line ${i}`).join('\n') + '\n'

// ─── Benchmarks ─────────────────────────────────────────────────────────────

summary(() => {
    bench('splitDetectStrip — simple', () => do_not_optimize(splitDetectStrip(simple)))
    bench('regexDetectReplace — simple', () => do_not_optimize(regexDetectReplace(simple)))
    bench('manualScan — simple', () => do_not_optimize(manualScan(simple)))
})

summary(() => {
    bench('splitDetectStrip — mixed', () => do_not_optimize(splitDetectStrip(mixed)))
    bench('regexDetectReplace — mixed', () => do_not_optimize(regexDetectReplace(mixed)))
    bench('manualScan — mixed', () => do_not_optimize(manualScan(mixed)))
})

summary(() => {
    bench('splitDetectStrip — noIndent', () => do_not_optimize(splitDetectStrip(noIndent)))
    bench('regexDetectReplace — noIndent', () => do_not_optimize(regexDetectReplace(noIndent)))
    bench('manualScan — noIndent', () => do_not_optimize(manualScan(noIndent)))
})

summary(() => {
    bench('splitDetectStrip — singleLine', () => do_not_optimize(splitDetectStrip(singleLine)))
    bench('regexDetectReplace — singleLine', () => do_not_optimize(regexDetectReplace(singleLine)))
    bench('manualScan — singleLine', () => do_not_optimize(manualScan(singleLine)))
})

summary(() => {
    bench('splitDetectStrip — empty', () => do_not_optimize(splitDetectStrip(empty)))
    bench('regexDetectReplace — empty', () => do_not_optimize(regexDetectReplace(empty)))
    bench('manualScan — empty', () => do_not_optimize(manualScan(empty)))
})

summary(() => {
    bench('splitDetectStrip — large (stress)', () => do_not_optimize(splitDetectStrip(large)))
    bench('regexDetectReplace — large (stress)', () => do_not_optimize(regexDetectReplace(large)))
    bench('manualScan — large (stress)', () => do_not_optimize(manualScan(large)))
})

await run()
