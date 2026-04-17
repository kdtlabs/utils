import { bench, do_not_optimize, run, summary } from 'mitata'

interface QuantInfo {
    len: number
    unbounded: boolean
}

function readQuantifier(source: string, i: number): QuantInfo | null {
    const c = source[i]

    if (c === '*' || c === '+') {
        return { len: source[i + 1] === '?' ? 2 : 1, unbounded: true }
    }

    if (c === '?') {
        return { len: source[i + 1] === '?' ? 2 : 1, unbounded: false }
    }

    if (c !== '{') {
        return null
    }

    let j = i + 1

    if (j >= source.length || source[j]! < '0' || source[j]! > '9') {
        return null
    }

    while (j < source.length && source[j]! >= '0' && source[j]! <= '9') {
        j++
    }

    let hasComma = false
    let hasMax = false

    if (source[j] === ',') {
        hasComma = true
        j++

        while (j < source.length && source[j]! >= '0' && source[j]! <= '9') {
            hasMax = true
            j++
        }
    }

    if (source[j] !== '}') {
        return null
    }

    j++

    if (source[j] === '?') {
        j++
    }

    return { len: j - i, unbounded: hasComma && !hasMax }
}

function approachStateMachine(source: string): string | null {
    const stack: Array<{ hasUnbounded: boolean }> = [{ hasUnbounded: false }]
    const len = source.length

    let i = 0

    while (i < len) {
        const c = source[i]

        if (c === '\\') {
            i += 2
            continue
        }

        if (c === '[') {
            i++

            while (i < len && source[i] !== ']') {
                if (source[i] === '\\') {
                    i++
                }

                i++
            }

            i++
            continue
        }

        if (c === '(') {
            i++

            if (source[i] === '?') {
                i++

                while (i < len && source[i] !== ':' && source[i] !== '>' && source[i] !== '(' && source[i] !== ')') {
                    i++
                }

                if (source[i] === ':' || source[i] === '>') {
                    i++
                }
            }

            stack.push({ hasUnbounded: false })
            continue
        }

        if (c === ')') {
            i++

            const closed = stack.pop()!
            const q = readQuantifier(source, i)
            const parent = stack.at(-1)!

            if (q) {
                i += q.len

                if (q.unbounded && closed.hasUnbounded) {
                    return 'nested unbounded quantifier'
                }

                if (q.unbounded) {
                    parent.hasUnbounded = true
                }
            }

            if (closed.hasUnbounded) {
                parent.hasUnbounded = true
            }

            continue
        }

        const q = readQuantifier(source, i)

        if (q) {
            if (q.unbounded) {
                stack.at(-1)!.hasUnbounded = true
            }

            i += q.len
            continue
        }

        i++
    }

    return null
}

const UNSAFE_PATTERNS = [
    /\([^)]*[*+][^)]*\)[*+]/u,
    /\([^)]*\{\d+,\}[^)]*\)[*+]/u,
    /\([^)]*[*+][^)]*\)\{\d+,\}/u,
]

function approachRegexScan(source: string): string | null {
    for (const pattern of UNSAFE_PATTERNS) {
        if (pattern.test(source)) {
            return 'suspicious pattern'
        }
    }

    return null
}

const safePatterns = [
    'hello',
    '^[a-zA-Z0-9]+$',
    String.raw`\d{3}-\d{4}`,
    '(foo|bar|baz)',
    String.raw`^https?:\/\/[^\s]+$`,
    '[A-Za-z_][A-Za-z0-9_]*',
    String.raw`^\d+(\.\d+)?$`,
]

const unsafePatterns = [
    '(a+)+',
    '(a*)*',
    '(.*)*',
    String.raw`(\w+)*`,
    String.raw`(a|aa)+`,
    '(a+b+)+',
    String.raw`^(\d+)+$`,
]

const complexPatterns = [
    String.raw`^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$`,
    String.raw`^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})(?:\.(?<ms>\d{3}))?Z?$`,
    String.raw`(?:\\.|[^"\\])*`,
]

summary(() => {
    bench('stateMachine / safe', () => {
        for (const p of safePatterns) {
            do_not_optimize(approachStateMachine(p))
        }
    })

    bench('regexScan    / safe', () => {
        for (const p of safePatterns) {
            do_not_optimize(approachRegexScan(p))
        }
    })

    bench('stateMachine / unsafe', () => {
        for (const p of unsafePatterns) {
            do_not_optimize(approachStateMachine(p))
        }
    })

    bench('regexScan    / unsafe', () => {
        for (const p of unsafePatterns) {
            do_not_optimize(approachRegexScan(p))
        }
    })

    bench('stateMachine / complex', () => {
        for (const p of complexPatterns) {
            do_not_optimize(approachStateMachine(p))
        }
    })

    bench('regexScan    / complex', () => {
        for (const p of complexPatterns) {
            do_not_optimize(approachRegexScan(p))
        }
    })
})

await run()
