import { describe, expect, it } from 'bun:test'
import { FifoMap } from '../../../src/collections/fifo-map'
import { FifoSet } from '../../../src/collections/fifo-set'
import { isCollectionLike } from '../../../src/collections/guards'
import { LruMap } from '../../../src/collections/lru-map'
import { LruSet } from '../../../src/collections/lru-set'

describe('isCollectionLike', () => {
    it('returns true for a Set', () => {
        expect(isCollectionLike(new Set())).toBe(true)
        expect(isCollectionLike(new Set([1, 2, 3]))).toBe(true)
    })

    it('returns true for a Map', () => {
        expect(isCollectionLike(new Map())).toBe(true)
        expect(isCollectionLike(new Map([['a', 1]]))).toBe(true)
    })

    it('returns true for a custom collection-like object', () => {
        const custom = {
            size: 3,
            * [Symbol.iterator]() {
                yield 1
                yield 2
                yield 3
            },
        }

        expect(isCollectionLike(custom)).toBe(true)
    })

    it('returns false for an array (no size property)', () => {
        expect(isCollectionLike([])).toBe(false)
        expect(isCollectionLike([1, 2, 3])).toBe(false)
    })

    it('returns false for a string (size is not a property)', () => {
        expect(isCollectionLike('hello')).toBe(false)
    })

    it('returns false for a typed array (has length, not size)', () => {
        expect(isCollectionLike(new Uint8Array())).toBe(false)
    })

    it('returns false for null', () => {
        expect(isCollectionLike(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isCollectionLike(undefined)).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isCollectionLike(42)).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isCollectionLike(true)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isCollectionLike({})).toBe(false)
    })

    it('returns false for an object with size but not iterable', () => {
        const fake = { size: 5 }
        expect(isCollectionLike(fake)).toBe(false)
    })

    it('returns false for an iterable without size', () => {
        const fake = {
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isCollectionLike(fake)).toBe(false)
    })

    it('returns false for an iterable with non-number size', () => {
        const fake = {
            size: 'three',
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isCollectionLike(fake)).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isCollectionLike(() => {})).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isCollectionLike(Symbol('test'))).toBe(false)
    })

    describe('edge cases', () => {
        it('returns false for a Date', () => {
            expect(isCollectionLike(new Date())).toBe(false)
        })

        it('returns false for a RegExp', () => {
            expect(isCollectionLike(/test/u)).toBe(false)
        })

        it('returns true for a FifoSet instance', () => {
            const set = new FifoSet<number>()
            set.add(1)
            expect(isCollectionLike(set)).toBe(true)
        })

        it('returns true for a FifoMap instance', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            expect(isCollectionLike(map)).toBe(true)
        })

        it('returns true for a LruSet instance', () => {
            const set = new LruSet<string>()
            set.add('a')
            expect(isCollectionLike(set)).toBe(true)
        })

        it('returns true for a LruMap instance', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            expect(isCollectionLike(map)).toBe(true)
        })

        it('returns false for a WeakSet', () => {
            expect(isCollectionLike(new WeakSet())).toBe(false)
        })

        it('returns false for a WeakMap', () => {
            expect(isCollectionLike(new WeakMap())).toBe(false)
        })

        it('returns true for an iterable with NaN size (typeof NaN is number)', () => {
            const fake = {
                size: Number.NaN,
                * [Symbol.iterator]() {
                    yield 1
                },
            }

            expect(isCollectionLike(fake)).toBe(true)
        })

        it('returns true for an iterable with Infinity size (typeof Infinity is number)', () => {
            const fake = {
                size: Infinity,
                * [Symbol.iterator]() {
                    yield 1
                },
            }

            expect(isCollectionLike(fake)).toBe(true)
        })

        it('returns true for an iterable with negative size (typeof negative is number)', () => {
            const fake = {
                size: -5,
                * [Symbol.iterator]() {
                    yield 1
                },
            }

            expect(isCollectionLike(fake)).toBe(true)
        })

        it('returns true for an empty FifoSet', () => {
            expect(isCollectionLike(new FifoSet())).toBe(true)
        })

        it('returns true for an empty LruMap', () => {
            expect(isCollectionLike(new LruMap())).toBe(true)
        })
    })
})
