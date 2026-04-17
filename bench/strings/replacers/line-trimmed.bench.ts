import { bench, do_not_optimize, run, summary } from 'mitata'

// Approach A: split-and-compare with Array.slice reconstruction
function splitArrays(source: string, search: string, replacement: string): string | null {
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
}

// Approach B: indexOf boundary scan on source, compute per-line trimmed slice without splitting
function boundaryScan(source: string, search: string, replacement: string): string | null {
    const searchLines = search.split('\n')
    const trimmedSearch = searchLines.map((l) => l.trim())
    const sLen = source.length
    const nLen = searchLines.length

    function trimmedSlice(start: number, end: number) {
        let s = start
        let e = end

        while (s < e && (source[s] === ' ' || source[s] === '\t')) {
            s++
        }

        while (e > s && (source[e - 1] === ' ' || source[e - 1] === '\t')) {
            e--
        }

        return source.slice(s, e)
    }

    const lineStarts: number[] = [0]

    for (let i = 0; i < sLen; i++) {
        if (source[i] === '\n') {
            lineStarts.push(i + 1)
        }
    }

    lineStarts.push(sLen + 1)

    const totalLines = lineStarts.length - 1

    for (let i = 0; i <= totalLines - nLen; i++) {
        let ok = true

        for (let k = 0; k < nLen; k++) {
            const start = lineStarts[i + k]!
            const end = lineStarts[i + k + 1]! - 1

            if (trimmedSlice(start, end) !== trimmedSearch[k]) {
                ok = false
                break
            }
        }

        if (ok) {
            const startChar = lineStarts[i]!
            const endChar = lineStarts[i + nLen]! - 1
            const prefix = startChar === 0 ? '' : source.slice(0, startChar)
            const suffix = endChar >= sLen ? '' : source.slice(endChar)

            return prefix + replacement + suffix
        }
    }

    return null
}

const source = `function foo() {
    const x = 1
      const y = 2
    return x + y
}`

const search = `const x = 1
const y = 2`

const replacement = `const z = 99`

summary(() => {
    bench('splitArrays', () => do_not_optimize(splitArrays(source, search, replacement)))
    bench('boundaryScan', () => do_not_optimize(boundaryScan(source, search, replacement)))
})

await run()
