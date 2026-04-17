import { bench, do_not_optimize, run, summary } from 'mitata'

function escapeRegExp(input: string) {
    return input.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`).replaceAll('-', String.raw`\x2d`)
}

function regexApproach(source: string, search: string, replacement: string): string | null {
    const pattern = search.replaceAll(/(\s+)|(\S+)/gu, (_m, ws, nonWs) => (ws ? String.raw`\s+` : escapeRegExp(nonWs)))
    const re = new RegExp(pattern, 'u')
    const match = re.exec(source)

    if (!match) {
        return null
    }

    return source.slice(0, match.index) + replacement + source.slice(match.index + match[0].length)
}

function twoPointerApproach(source: string, search: string, replacement: string): string | null {
    const sLen = source.length
    const nLen = search.length
    const WS = /\s/u

    if (nLen === 0) {
        return null
    }

    for (let i = 0; i <= sLen; i++) {
        let si = i
        let pi = 0
        let ok = true

        while (pi < nLen) {
            const pc = search[pi]!

            if (WS.test(pc)) {
                if (si >= sLen || !WS.test(source[si]!)) {
                    ok = false
                    break
                }

                while (pi < nLen && WS.test(search[pi]!)) {
                    pi++
                }

                while (si < sLen && WS.test(source[si]!)) {
                    si++
                }

                continue
            }

            if (si >= sLen || source[si] !== pc) {
                ok = false
                break
            }

            si++
            pi++
        }

        if (ok && pi === nLen) {
            return source.slice(0, i) + replacement + source.slice(si)
        }
    }

    return null
}

const source = `function   foo() {\n\tconst  x = 1\n\treturn  x\n}`
const search = `const x = 1\nreturn x`
const replacement = `const z = 99`

summary(() => {
    bench('regex', () => do_not_optimize(regexApproach(source, search, replacement)))
    bench('twoPointer', () => do_not_optimize(twoPointerApproach(source, search, replacement)))
})

await run()
