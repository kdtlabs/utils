import { bench, do_not_optimize, run, summary } from 'mitata'

// ─── Approaches ─────────────────────────────────────────────────────────────

// Approach A: regex replace — prepend to each line start
function regexReplace(str: string, count: number) {
    const pad = ' '.repeat(count)

    return str.replace(/^/gm, pad)
}

// Approach B: split + map + join
function splitMapJoin(str: string, count: number) {
    const pad = ' '.repeat(count)

    return str.split('\n').map((line) => pad + line).join('\n')
}

// Approach C: replaceAll newlines
function replaceAllNewlines(str: string, count: number) {
    const pad = ' '.repeat(count)

    return pad + str.replaceAll('\n', '\n' + pad)
}

// ─── Datasets ───────────────────────────────────────────────────────────────

const singleLine = 'Hello, world!'
const multiLine = 'line 1\nline 2\nline 3\nline 4\nline 5'
const indented = '  line 1\n    line 2\n  line 3'
const empty = ''
const manyLines = Array.from({ length: 100 }, (_, i) => `line ${i}`).join('\n')

// ─── Benchmarks ─────────────────────────────────────────────────────────────

summary(() => {
    bench('regexReplace — singleLine', () => do_not_optimize(regexReplace(singleLine, 4)))
    bench('splitMapJoin — singleLine', () => do_not_optimize(splitMapJoin(singleLine, 4)))
    bench('replaceAllNewlines — singleLine', () => do_not_optimize(replaceAllNewlines(singleLine, 4)))
})

summary(() => {
    bench('regexReplace — multiLine', () => do_not_optimize(regexReplace(multiLine, 4)))
    bench('splitMapJoin — multiLine', () => do_not_optimize(splitMapJoin(multiLine, 4)))
    bench('replaceAllNewlines — multiLine', () => do_not_optimize(replaceAllNewlines(multiLine, 4)))
})

summary(() => {
    bench('regexReplace — indented', () => do_not_optimize(regexReplace(indented, 2)))
    bench('splitMapJoin — indented', () => do_not_optimize(splitMapJoin(indented, 2)))
    bench('replaceAllNewlines — indented', () => do_not_optimize(replaceAllNewlines(indented, 2)))
})

summary(() => {
    bench('regexReplace — empty', () => do_not_optimize(regexReplace(empty, 4)))
    bench('splitMapJoin — empty', () => do_not_optimize(splitMapJoin(empty, 4)))
    bench('replaceAllNewlines — empty', () => do_not_optimize(replaceAllNewlines(empty, 4)))
})

summary(() => {
    bench('regexReplace — manyLines (stress)', () => do_not_optimize(regexReplace(manyLines, 4)))
    bench('splitMapJoin — manyLines (stress)', () => do_not_optimize(splitMapJoin(manyLines, 4)))
    bench('replaceAllNewlines — manyLines (stress)', () => do_not_optimize(replaceAllNewlines(manyLines, 4)))
})

await run()
