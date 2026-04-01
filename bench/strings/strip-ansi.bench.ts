import { bench, do_not_optimize, run, summary } from 'mitata'

// ─── Approaches ─────────────────────────────────────────────────────────────

// Approach A: Single comprehensive regex
const ANSI_REGEX_A = /\x1B(?:\[[0-9;]*[A-Za-z]|\].*?(?:\x07|\x1B\\)|\([A-Za-z]|[A-Z])/g

function singleRegex(str: string) {
    return str.replace(ANSI_REGEX_A, '')
}

// Approach B: Manual state machine
function stateMachine(str: string) {
    const len = str.length

    let result = ''
    let i = 0

    while (i < len) {
        if (str.charCodeAt(i) !== 0x1B) {
            result += str[i]
            i++
            continue
        }

        i++ // skip ESC

        if (i >= len) {
            break
        }

        const next = str.charCodeAt(i)

        if (next === 0x5B) {
            // CSI: skip until final byte [A-Za-z]
            i++

            while (i < len && !((str.charCodeAt(i) >= 0x41 && str.charCodeAt(i) <= 0x5A) || (str.charCodeAt(i) >= 0x61 && str.charCodeAt(i) <= 0x7A))) {
                i++
            }

            i++ // skip final byte
        } else if (next === 0x5D) {
            // OSC: skip until ST (\x1B\\) or BEL (\x07)
            i++

            while (i < len) {
                if (str.charCodeAt(i) === 0x07) {
                    i++
                    break
                }

                if (str.charCodeAt(i) === 0x1B && i + 1 < len && str.charCodeAt(i + 1) === 0x5C) {
                    i += 2
                    break
                }

                i++
            }
        } else if (next === 0x28) {
            // Character set designation: skip 2 chars
            i += 2
        } else if (next >= 0x41 && next <= 0x5A) {
            // Single-character escape
            i++
        }
    }

    return result
}

// Approach C: Split on ESC + filter/rebuild
function splitFilter(str: string) {
    const parts = str.split('\x1B')

    if (parts.length === 1) {
        return str
    }

    let result = parts[0]!

    for (let i = 1; i < parts.length; i++) {
        const part = parts[i]!

        if (part.length === 0) {
            continue
        }

        const first = part.charCodeAt(0)

        if (first === 0x5B) {
            // CSI: find end
            let j = 1

            while (j < part.length && !((part.charCodeAt(j) >= 0x41 && part.charCodeAt(j) <= 0x5A) || (part.charCodeAt(j) >= 0x61 && part.charCodeAt(j) <= 0x7A))) {
                j++
            }

            result += part.slice(j + 1)
        } else if (first === 0x5D) {
            // OSC: find BEL or ST
            let j = 1

            while (j < part.length) {
                if (part.charCodeAt(j) === 0x07) {
                    result += part.slice(j + 1)
                    break
                }

                if (part.charCodeAt(j) === 0x1B && j + 1 < part.length && part.charCodeAt(j + 1) === 0x5C) {
                    result += part.slice(j + 2)
                    break
                }

                j++
            }
        } else if (first === 0x28) {
            result += part.slice(2)
        } else if (first >= 0x41 && first <= 0x5A) {
            result += part.slice(1)
        } else {
            result += part
        }
    }

    return result
}

// ─── Datasets ───────────────────────────────────────────────────────────────

const plain = 'Hello, world! This is a plain string with no ANSI codes.'
const sgrSimple = '\x1B[31mHello\x1B[0m'
const sgrComplex = '\x1B[1;4;38;2;255;100;0mHello\x1B[0m \x1B[32mWorld\x1B[0m \x1B[43;1mBold\x1B[0m'
const osc8 = '\x1B]8;;https://example.com\x1B\\Click here\x1B]8;;\x1B\\'
const mixed = `\x1B[1mBold\x1B[0m normal \x1B[31mred\x1B[0m \x1B]8;;https://x.com\x1B\\link\x1B]8;;\x1B\\ end`
const heavy = (`\x1B[31m${'x'.repeat(10)}\x1B[0m`).repeat(50)
const empty = ''
const onlyAnsi = '\x1B[31m\x1B[42m\x1B[1m\x1B[0m'

// ─── Benchmarks ─────────────────────────────────────────────────────────────

summary(() => {
    bench('singleRegex — plain', () => do_not_optimize(singleRegex(plain)))
    bench('stateMachine — plain', () => do_not_optimize(stateMachine(plain)))
    bench('splitFilter — plain', () => do_not_optimize(splitFilter(plain)))
})

summary(() => {
    bench('singleRegex — sgrSimple', () => do_not_optimize(singleRegex(sgrSimple)))
    bench('stateMachine — sgrSimple', () => do_not_optimize(stateMachine(sgrSimple)))
    bench('splitFilter — sgrSimple', () => do_not_optimize(splitFilter(sgrSimple)))
})

summary(() => {
    bench('singleRegex — sgrComplex', () => do_not_optimize(singleRegex(sgrComplex)))
    bench('stateMachine — sgrComplex', () => do_not_optimize(stateMachine(sgrComplex)))
    bench('splitFilter — sgrComplex', () => do_not_optimize(splitFilter(sgrComplex)))
})

summary(() => {
    bench('singleRegex — osc8', () => do_not_optimize(singleRegex(osc8)))
    bench('stateMachine — osc8', () => do_not_optimize(stateMachine(osc8)))
    bench('splitFilter — osc8', () => do_not_optimize(splitFilter(osc8)))
})

summary(() => {
    bench('singleRegex — mixed', () => do_not_optimize(singleRegex(mixed)))
    bench('stateMachine — mixed', () => do_not_optimize(stateMachine(mixed)))
    bench('splitFilter — mixed', () => do_not_optimize(splitFilter(mixed)))
})

summary(() => {
    bench('singleRegex — heavy (stress)', () => do_not_optimize(singleRegex(heavy)))
    bench('stateMachine — heavy (stress)', () => do_not_optimize(stateMachine(heavy)))
    bench('splitFilter — heavy (stress)', () => do_not_optimize(splitFilter(heavy)))
})

summary(() => {
    bench('singleRegex — empty', () => do_not_optimize(singleRegex(empty)))
    bench('stateMachine — empty', () => do_not_optimize(stateMachine(empty)))
    bench('splitFilter — empty', () => do_not_optimize(splitFilter(empty)))
})

summary(() => {
    bench('singleRegex — onlyAnsi', () => do_not_optimize(singleRegex(onlyAnsi)))
    bench('stateMachine — onlyAnsi', () => do_not_optimize(stateMachine(onlyAnsi)))
    bench('splitFilter — onlyAnsi', () => do_not_optimize(splitFilter(onlyAnsi)))
})

await run()
