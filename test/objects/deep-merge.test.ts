import { describe, expect, it } from 'bun:test'
import { deepMerge } from '@/objects/deep-merge'

describe('deepMerge', () => {
    it('merges flat objects', () => {
        expect(deepMerge<Record<string, number>>({ a: 1, b: 2 }, { b: 20, c: 3 })).toEqual({ a: 1, b: 20, c: 3 })
    })

    it('merges deeply nested objects', () => {
        const base: Record<string, any> = { a: { b: { c: 1, d: 2 }, e: 3 }, f: 4 }
        const override: Record<string, any> = { a: { b: { c: 10, g: 5 }, e: 30 }, h: 6 }

        expect(deepMerge(base, override)).toEqual({
            a: { b: { c: 10, d: 2, g: 5 }, e: 30 },
            f: 4,
            h: 6,
        })
    })

    it('preserves keys only in base', () => {
        expect(deepMerge({ a: 1, b: 2 }, { a: 10 })).toEqual({ a: 10, b: 2 })
    })

    it('adds keys only in override', () => {
        expect(deepMerge<Record<string, number>>({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    })

    it('override wins for non-object values', () => {
        expect(deepMerge<Record<string, any>>({ a: 1 }, { a: 'hello' })).toEqual({ a: 'hello' })
    })

    it('override wins when base has object and override has primitive', () => {
        expect(deepMerge<Record<string, any>>({ a: { nested: 1 } }, { a: 42 })).toEqual({ a: 42 })
    })

    it('override wins when base has primitive and override has object', () => {
        expect(deepMerge<Record<string, any>>({ a: 1 }, { a: { nested: 1 } })).toEqual({ a: { nested: 1 } })
    })

    it('does not mutate base', () => {
        const base = { a: { b: 1 }, c: [1, 2] }
        const override = { a: { b: 2 }, c: [3] }

        deepMerge(base, override)

        expect(base).toEqual({ a: { b: 1 }, c: [1, 2] })
    })

    it('does not mutate override', () => {
        const base = { a: { b: 1 } }
        const override = { a: { b: 2, c: 3 } }
        const overrideCopy = { a: { b: 2, c: 3 } }

        deepMerge(base, override)

        expect(override).toEqual(overrideCopy)
    })

    describe('arrayMode: replace (default)', () => {
        it('replaces arrays by default', () => {
            expect(deepMerge({ tags: ['a', 'b'] }, { tags: ['b', 'c'] })).toEqual({ tags: ['b', 'c'] })
        })

        it('replaces arrays explicitly', () => {
            expect(deepMerge({ tags: ['a', 'b'] }, { tags: ['b', 'c'] }, { arrayMode: 'replace' })).toEqual({ tags: ['b', 'c'] })
        })
    })

    describe('arrayMode: merge', () => {
        it('concatenates arrays', () => {
            expect(deepMerge({ tags: ['a', 'b'] }, { tags: ['b', 'c'] }, { arrayMode: 'merge' })).toEqual({ tags: ['a', 'b', 'b', 'c'] })
        })

        it('concatenates nested arrays at key level', () => {
            const base = { config: { items: [1, 2] } }
            const override = { config: { items: [3, 4] } }

            expect(deepMerge(base, override, { arrayMode: 'merge' })).toEqual({ config: { items: [1, 2, 3, 4] } })
        })
    })

    describe('arrayMode: merge-dedupe', () => {
        it('concatenates and deduplicates arrays', () => {
            expect(deepMerge({ tags: ['a', 'b'] }, { tags: ['b', 'c'] }, { arrayMode: 'merge-dedupe' })).toEqual({ tags: ['a', 'b', 'c'] })
        })

        it('does not deduplicate reference-different objects', () => {
            const base = { items: [{ id: 1 }] }
            const override = { items: [{ id: 1 }] }
            const result = deepMerge(base, override, { arrayMode: 'merge-dedupe' })

            expect(result.items).toHaveLength(2)
        })

        it('deduplicates primitives correctly', () => {
            expect(deepMerge({ nums: [1, 2, 3] }, { nums: [2, 3, 4] }, { arrayMode: 'merge-dedupe' })).toEqual({ nums: [1, 2, 3, 4] })
        })
    })

    describe('edge cases', () => {
        it('undefined in override wins', () => {
            const result = deepMerge({ a: 1, b: 2 }, { a: undefined })

            expect(result.a).toBeUndefined()
            expect('a' in result).toBe(true)
            expect(result.b).toBe(2)
        })

        it('skips __proto__ key', () => {
            const override = JSON.parse('{"__proto__": {"isAdmin": true}, "a": 1}')
            const result = deepMerge<Record<string, any>>({}, override)

            expect(result.a).toBe(1)
            expect((result as any).isAdmin).toBeUndefined()
            expect(Object.keys(result)).not.toContain('__proto__')
        })

        it('skips constructor key', () => {
            const result = deepMerge({}, { constructor: 'evil' } as any)

            expect(Object.keys(result)).not.toContain('constructor')
        })

        it('skips prototype key', () => {
            const result = deepMerge({}, { prototype: 'evil' } as any)

            expect(Object.keys(result)).not.toContain('prototype')
        })

        it('ignores symbol keys', () => {
            const sym = Symbol('test')
            const base = { a: 1, [sym]: 'symbol' } as any
            const override = { a: 2, [sym]: 'override' } as any
            const result = deepMerge(base, override)

            expect(result.a).toBe(2)
            expect(Object.getOwnPropertySymbols(result)).toHaveLength(0)
        })

        it('keeps non-plain objects by reference', () => {
            const date = new Date()
            const regex = /test/u

            const result = deepMerge<Record<string, any>>({ d: date }, { d: regex })

            expect(result.d).toBe(regex)
        })

        it('keeps non-plain object from base when not overridden', () => {
            const date = new Date()
            const result = deepMerge({ a: 1, d: date }, { a: 2 })

            expect(result.d).toBe(date)
        })

        it('merges empty base with override', () => {
            const override = { a: { b: 1 }, c: [1, 2] }
            const result = deepMerge({} as typeof override, override)

            expect(result).toEqual(override)
            expect(result.a).not.toBe(override.a)
        })

        it('merges base with empty override', () => {
            const base = { a: { b: 1 }, c: [1, 2] }
            const result = deepMerge(base, {})

            expect(result).toEqual(base)
            expect(result.a).not.toBe(base.a)
        })

        it('arrayMode does not apply to nested arrays inside arrays', () => {
            const base = { matrix: [[1, 2], [3, 4]] }
            const override = { matrix: [[5, 6]] }
            const result = deepMerge(base, override, { arrayMode: 'merge' })

            expect(result.matrix).toEqual([[1, 2], [3, 4], [5, 6]])
        })

        it('handles 4 levels of nesting', () => {
            const base: Record<string, any> = { a: { b: { c: { d: 1, e: 2 } } } }
            const override: Record<string, any> = { a: { b: { c: { d: 10, f: 3 } } } }

            expect(deepMerge(base, override)).toEqual({ a: { b: { c: { d: 10, e: 2, f: 3 } } } })
        })
    })
})
