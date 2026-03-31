import type { AnyObject } from '../../src/objects/types'
import { bench, do_not_optimize, run, summary } from 'mitata'
import { deepMerge } from '../../src/objects/deep-merge'

interface MergePair {
    base: AnyObject
    override: AnyObject
}

// ─── Datasets ───────────────────────────────────────────────────────────────

const shallow = {
    base: { a: 1, b: 'hello', c: true, d: null },
    override: { b: 'world', d: 42 },
}

const nested = {
    base: { a: { b: { c: { d: 1 } } }, x: { y: 'z' } },
    override: { a: { b: { c: { d: 2, e: 3 } } } },
}

const withArrays = {
    base: { tags: ['a', 'b', 'c'], nested: { items: [1, 2, 3] } },
    override: { tags: ['d', 'e'], nested: { items: [4, 5] } },
}

const empty = {
    base: {},
    override: { a: 1, b: { c: 2 } },
}

const manyKeys = {
    base: Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, { value: i, nested: { deep: i } }])),
    override: Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`key${i}`, { value: i * 10, extra: true }])),
}

const deeplyNested = (() => {
    let base: Record<string, unknown> = { value: 0 }
    let override: Record<string, unknown> = { value: 1 }

    for (let i = 0; i < 20; i++) {
        base = { child: base }
        override = { child: override }
    }

    return { base, override }
})()

const withDuplicateArrays = {
    base: { items: [1, 2, 3, 4, 5] },
    override: { items: [3, 4, 5, 6, 7] },
}

// ─── Benchmarks ─────────────────────────────────────────────────────────────

summary(() => {
    bench('shallow merge', function* () {
        yield {
            [0]() { return { ...shallow } },
            bench({ base, override }: MergePair) { do_not_optimize(deepMerge(base, override)) },
        }
    })

    bench('nested 4 levels', function* () {
        yield {
            [0]() { return { base: structuredClone(nested.base), override: structuredClone(nested.override) } },
            bench({ base, override }: MergePair) { do_not_optimize(deepMerge(base, override)) },
        }
    })

    bench('arrays (replace)', function* () {
        yield {
            [0]() { return { base: structuredClone(withArrays.base), override: structuredClone(withArrays.override) } },
            bench({ base, override }: MergePair) { do_not_optimize(deepMerge(base, override, { arrayMode: 'replace' })) },
        }
    })

    bench('arrays (merge)', function* () {
        yield {
            [0]() { return { base: structuredClone(withArrays.base), override: structuredClone(withArrays.override) } },
            bench({ base, override }: MergePair) { do_not_optimize(deepMerge(base, override, { arrayMode: 'merge' })) },
        }
    })

    bench('arrays (merge-dedupe)', function* () {
        yield {
            [0]() { return { base: structuredClone(withDuplicateArrays.base), override: structuredClone(withDuplicateArrays.override) } },
            bench({ base, override }: MergePair) { do_not_optimize(deepMerge(base, override, { arrayMode: 'merge-dedupe' })) },
        }
    })

    bench('empty base', function* () {
        yield {
            [0]() { return { ...empty } },
            bench({ base, override }: MergePair) { do_not_optimize(deepMerge(base, override)) },
        }
    })

    bench('100 keys (stress)', function* () {
        yield {
            [0]() { return { base: structuredClone(manyKeys.base), override: structuredClone(manyKeys.override) } },
            bench({ base, override }: MergePair) { do_not_optimize(deepMerge(base, override)) },
        }
    })

    bench('20 levels deep (stress)', function* () {
        yield {
            [0]() { return { base: structuredClone(deeplyNested.base), override: structuredClone(deeplyNested.override) } },
            bench({ base, override }: MergePair) { do_not_optimize(deepMerge(base, override)) },
        }
    })
})

await run()
