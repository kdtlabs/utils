import { describe, expect, it } from 'bun:test'
import { memoize } from '@/functions/memoize'

describe('memoize', () => {
    it('returns the same result for the same first argument', () => {
        let count = 0

        const fn = memoize((n: number) => {
            count++

            return n * 2
        })

        expect(fn(5)).toBe(10)
        expect(fn(5)).toBe(10)
        expect(count).toBe(1)
    })

    it('computes new result for different arguments', () => {
        let count = 0

        const fn = memoize((n: number) => {
            count++

            return n * 2
        })

        expect(fn(1)).toBe(2)
        expect(fn(2)).toBe(4)
        expect(count).toBe(2)
    })

    it('uses first argument as default cache key', () => {
        let count = 0

        const fn = memoize((a: number, _b: number) => {
            count++

            return a
        })

        fn(1, 10)
        fn(1, 20)

        expect(count).toBe(1)
    })

    it('exposes cache instance', () => {
        const fn = memoize((n: number) => n * 2)

        fn(5)

        expect(fn.cache.has(5)).toBe(true)
        expect(fn.cache.get(5)).toBe(10)
    })

    describe('resolver', () => {
        it('uses resolver for cache key', () => {
            let count = 0

            const fn = memoize(
                (a: number, b: number) => {
                    count++

                    return a + b
                },
                { resolver: (a, b) => `${a}:${b}` },
            )

            expect(fn(1, 2)).toBe(3)
            expect(fn(1, 2)).toBe(3)
            expect(fn(1, 3)).toBe(4)
            expect(count).toBe(2)
        })
    })

    describe('custom cache', () => {
        it('uses provided cache', () => {
            const customCache = new Map<unknown, number>()
            const fn = memoize((n: number) => n * 2, { cache: customCache })

            fn(5)

            expect(customCache.get(5)).toBe(10)
            expect(fn.cache).toBe(customCache)
        })

        it('respects pre-populated cache', () => {
            const customCache = new Map<unknown, number>([[5, 99]])
            const fn = memoize((n: number) => n * 2, { cache: customCache })

            expect(fn(5)).toBe(99)
        })
    })

    it('preserves this context', () => {
        const captured: unknown[] = []

        const fn = memoize(function (this: unknown) {
            captured.push(this)

            return 1
        })

        const ctx = { name: 'test' }

        fn.call(ctx)

        expect(captured[0]).toBe(ctx)
    })

    it('supports cache delete for invalidation', () => {
        let count = 0

        const fn = memoize((n: number) => {
            count++

            return n * 2
        })

        fn(5)
        fn.cache.delete(5)
        fn(5)

        expect(count).toBe(2)
    })
})
