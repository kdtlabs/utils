import { bench, do_not_optimize, run, summary } from 'mitata'

type StringSortType = 'alphabetical' | 'length' | 'natural'

// ── Approach A: operator-only ───────────────────────────────────────────────

const COLLATOR_NATURAL_A = new Intl.Collator(undefined, { numeric: true, sensitivity: 'variant' })

function ascOperatorOnly(type?: StringSortType): (a: any, b: any) => number {
    if (type === 'natural') {
        const cmp = COLLATOR_NATURAL_A.compare

        return (a: string, b: string) => cmp(a, b)
    }

    if (type === 'length') {
        return (a: string, b: string) => a.length - b.length
    }

    return <T extends bigint | number | string>(a: T, b: T) => {
        if (a < b) {
            return -1
        }

        if (a > b) {
            return 1
        }

        return 0
    }
}

// ── Approach B: subtract with typeof ────────────────────────────────────────

const COLLATOR_NATURAL_B = new Intl.Collator(undefined, { numeric: true, sensitivity: 'variant' })

function ascSubtractTypeof(type?: StringSortType): (a: any, b: any) => number {
    if (type === 'natural') {
        const cmp = COLLATOR_NATURAL_B.compare

        return (a: string, b: string) => cmp(a, b)
    }

    if (type === 'length') {
        return (a: string, b: string) => a.length - b.length
    }

    return <T extends bigint | number | string>(a: T, b: T) => {
        if (typeof a === 'string') {
            if (a < b) {
                return -1
            }

            if (a > b) {
                return 1
            }

            return 0
        }

        return Number(a) - Number(b)
    }
}

// ── Approach C: localeCompare for string default ────────────────────────────

const COLLATOR_ALPHA_C = new Intl.Collator(undefined, { sensitivity: 'variant' })
const COLLATOR_NATURAL_C = new Intl.Collator(undefined, { numeric: true, sensitivity: 'variant' })

function ascLocaleCompare(type?: StringSortType): (a: any, b: any) => number {
    if (type === 'natural') {
        const cmp = COLLATOR_NATURAL_C.compare

        return (a: string, b: string) => cmp(a, b)
    }

    if (type === 'length') {
        return (a: string, b: string) => a.length - b.length
    }

    return <T extends bigint | number | string>(a: T, b: T) => {
        if (typeof a === 'string') {
            return COLLATOR_ALPHA_C.compare(a as string, b as string)
        }

        if (a < b) {
            return -1
        }

        if (a > b) {
            return 1
        }

        return 0
    }
}

// ── Datasets ────────────────────────────────────────────────────────────────

const numbers = Array.from({ length: 1000 }, () => Math.random() * 10000)
const bigints = Array.from({ length: 1000 }, (_, i) => BigInt(Math.floor(Math.random() * 10000)) + BigInt(i))
const strings = Array.from({ length: 1000 }, () => Math.random().toString(36).slice(2, 8))
const naturalStrings = Array.from({ length: 1000 }, (_, i) => `file${i + 1}.txt`)
const lengthStrings = Array.from({ length: 1000 }, () => 'x'.repeat(Math.floor(Math.random() * 100)))

const smallNumbers = [5, 3, 1, 4, 2]
const emptyArray: number[] = []

// ── Numbers ─────────────────────────────────────────────────────────────────

summary(() => {
    bench('operatorOnly — numbers (1000)', () => do_not_optimize([...numbers].sort(ascOperatorOnly())))
    bench('subtractTypeof — numbers (1000)', () => do_not_optimize([...numbers].sort(ascSubtractTypeof())))
    bench('localeCompare — numbers (1000)', () => do_not_optimize([...numbers].sort(ascLocaleCompare())))
})

// ── BigInts ─────────────────────────────────────────────────────────────────

summary(() => {
    bench('operatorOnly — bigints (1000)', () => do_not_optimize([...bigints].sort(ascOperatorOnly())))
    bench('subtractTypeof — bigints (1000)', () => do_not_optimize([...bigints].sort(ascSubtractTypeof())))
    bench('localeCompare — bigints (1000)', () => do_not_optimize([...bigints].sort(ascLocaleCompare())))
})

// ── Strings (alphabetical) ─────────────────────────────────────────────────

summary(() => {
    bench('operatorOnly — strings (1000)', () => do_not_optimize([...strings].sort(ascOperatorOnly())))
    bench('subtractTypeof — strings (1000)', () => do_not_optimize([...strings].sort(ascSubtractTypeof())))
    bench('localeCompare — strings (1000)', () => do_not_optimize([...strings].sort(ascLocaleCompare())))
})

// ── Strings (natural) ──────────────────────────────────────────────────────

summary(() => {
    bench('operatorOnly — natural (1000)', () => do_not_optimize([...naturalStrings].sort(ascOperatorOnly('natural'))))
    bench('subtractTypeof — natural (1000)', () => do_not_optimize([...naturalStrings].sort(ascSubtractTypeof('natural'))))
    bench('localeCompare — natural (1000)', () => do_not_optimize([...naturalStrings].sort(ascLocaleCompare('natural'))))
})

// ── Strings (length) ───────────────────────────────────────────────────────

summary(() => {
    bench('operatorOnly — length (1000)', () => do_not_optimize([...lengthStrings].sort(ascOperatorOnly('length'))))
    bench('subtractTypeof — length (1000)', () => do_not_optimize([...lengthStrings].sort(ascSubtractTypeof('length'))))
    bench('localeCompare — length (1000)', () => do_not_optimize([...lengthStrings].sort(ascLocaleCompare('length'))))
})

// ── Small array ─────────────────────────────────────────────────────────────

summary(() => {
    bench('operatorOnly — small (5)', () => do_not_optimize([...smallNumbers].sort(ascOperatorOnly())))
    bench('subtractTypeof — small (5)', () => do_not_optimize([...smallNumbers].sort(ascSubtractTypeof())))
    bench('localeCompare — small (5)', () => do_not_optimize([...smallNumbers].sort(ascLocaleCompare())))
})

// ── Empty array ─────────────────────────────────────────────────────────────

summary(() => {
    bench('operatorOnly — empty', () => do_not_optimize([...emptyArray].sort(ascOperatorOnly())))
    bench('subtractTypeof — empty', () => do_not_optimize([...emptyArray].sort(ascSubtractTypeof())))
    bench('localeCompare — empty', () => do_not_optimize([...emptyArray].sort(ascLocaleCompare())))
})

await run()
