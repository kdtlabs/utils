import { describe, expect, it } from 'bun:test'
import { FifoMap } from '@/collections/fifo-map'
import { FifoSet } from '@/collections/fifo-set'
import { isSetLike } from '@/collections/guards'
import { LruMap } from '@/collections/lru-map'
import { LruSet } from '@/collections/lru-set'

describe('isSetLike', () => {
    it('returns true for a Set', () => {
        expect(isSetLike(new Set())).toBe(true)
        expect(isSetLike(new Set([1, 2, 3]))).toBe(true)
    })

    it('returns true for a custom set-like object', () => {
        const custom = {
            has(_value: unknown) {
                return true
            },
            size: 2,
            * [Symbol.iterator]() {
                yield 1
                yield 2
            },
        }

        expect(isSetLike(custom)).toBe(true)
    })

    it('returns true for a Map (Map also has .has)', () => {
        expect(isSetLike(new Map())).toBe(true)
    })

    it('returns false for an array', () => {
        expect(isSetLike([])).toBe(false)
    })

    it('returns false for null', () => {
        expect(isSetLike(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isSetLike(undefined)).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isSetLike(42)).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isSetLike(false)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isSetLike('hello')).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isSetLike({})).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isSetLike(() => {})).toBe(false)
    })

    it('returns false for a collection-like without has', () => {
        const fake = {
            size: 1,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isSetLike(fake)).toBe(false)
    })

    it('returns false for a collection-like with non-function has', () => {
        const fake = {
            has: 'not a function',
            size: 1,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isSetLike(fake)).toBe(false)
    })

    it('returns false for an object with has but not iterable', () => {
        const fake = { has: () => true, size: 1 }
        expect(isSetLike(fake)).toBe(false)
    })

    it('returns false for an object with has and iterable but no size', () => {
        const fake = {
            has: () => true,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isSetLike(fake)).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isSetLike(Symbol('test'))).toBe(false)
    })

    describe('edge cases', () => {
        it('returns true for a FifoSet', () => {
            expect(isSetLike(new FifoSet())).toBe(true)
        })

        it('returns true for a LruSet', () => {
            expect(isSetLike(new LruSet())).toBe(true)
        })

        it('returns true for a FifoMap (has .has() method)', () => {
            expect(isSetLike(new FifoMap())).toBe(true)
        })

        it('returns true for a LruMap (has .has() method)', () => {
            expect(isSetLike(new LruMap())).toBe(true)
        })

        it('returns false for a WeakSet', () => {
            expect(isSetLike(new WeakSet())).toBe(false)
        })

        it('returns false for a WeakMap', () => {
            expect(isSetLike(new WeakMap())).toBe(false)
        })

        it('returns true for a set-like with has returning non-boolean', () => {
            const fake = {
                has: () => 'yes',
                size: 1,
                * [Symbol.iterator]() {
                    yield 1
                },
            }

            expect(isSetLike(fake)).toBe(true)
        })

        it('returns false for a Date', () => {
            expect(isSetLike(new Date())).toBe(false)
        })

        it('returns false for a RegExp', () => {
            expect(isSetLike(/test/u)).toBe(false)
        })

        it('returns true for a FifoSet with items', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b')
            expect(isSetLike(set)).toBe(true)
        })

        it('returns true for a LruSet with items', () => {
            const set = new LruSet<number>()
            set.add(1).add(2)
            expect(isSetLike(set)).toBe(true)
        })
    })
})
