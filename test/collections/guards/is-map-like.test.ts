import { describe, expect, it } from 'bun:test'
import { FifoMap } from '../../../src/collections/fifo-map'
import { FifoSet } from '../../../src/collections/fifo-set'
import { isMapLike } from '../../../src/collections/guards'
import { LruMap } from '../../../src/collections/lru-map'
import { LruSet } from '../../../src/collections/lru-set'

describe('isMapLike', () => {
    it('returns true for a Map', () => {
        expect(isMapLike(new Map())).toBe(true)
        expect(isMapLike(new Map([['a', 1]]))).toBe(true)
    })

    it('returns true for a custom map-like object', () => {
        const custom = {
            entries() {
                return [][Symbol.iterator]()
            },
            get(_key: unknown) {},
            size: 1,
            * [Symbol.iterator]() {
                yield ['a', 1]
            },
        }

        expect(isMapLike(custom)).toBe(true)
    })

    it('returns false for a Set (no get or entries)', () => {
        expect(isMapLike(new Set())).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isMapLike([])).toBe(false)
    })

    it('returns false for null', () => {
        expect(isMapLike(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isMapLike(undefined)).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isMapLike(42)).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isMapLike(true)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isMapLike('hello')).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isMapLike({})).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isMapLike(() => {})).toBe(false)
    })

    it('returns false for a collection-like without get or entries', () => {
        const fake = {
            size: 1,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isMapLike(fake)).toBe(false)
    })

    it('returns false for a collection-like with get but without entries', () => {
        const fake = {
            get: () => {},
            size: 1,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isMapLike(fake)).toBe(false)
    })

    it('returns false for a collection-like with entries but without get', () => {
        const fake = {
            entries: () => [][Symbol.iterator](),
            size: 1,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isMapLike(fake)).toBe(false)
    })

    it('returns false for a collection-like with non-function get', () => {
        const fake = {
            entries: () => [][Symbol.iterator](),
            get: 'not a function',
            size: 1,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isMapLike(fake)).toBe(false)
    })

    it('returns false for a collection-like with non-function entries', () => {
        const fake = {
            entries: 'not a function',
            get: () => {},
            size: 1,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isMapLike(fake)).toBe(false)
    })

    it('returns false for an object with get and entries but not iterable', () => {
        const fake = {
            entries: () => [][Symbol.iterator](),
            get: () => {},
            size: 1,
        }

        expect(isMapLike(fake)).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isMapLike(Symbol('test'))).toBe(false)
    })

    describe('edge cases', () => {
        it('returns true for a FifoMap', () => {
            expect(isMapLike(new FifoMap())).toBe(true)
        })

        it('returns true for a LruMap', () => {
            expect(isMapLike(new LruMap())).toBe(true)
        })

        it('returns false for a FifoSet', () => {
            expect(isMapLike(new FifoSet())).toBe(false)
        })

        it('returns false for a LruSet', () => {
            expect(isMapLike(new LruSet())).toBe(false)
        })

        it('returns false for a WeakMap', () => {
            expect(isMapLike(new WeakMap())).toBe(false)
        })

        it('returns false for a WeakSet', () => {
            expect(isMapLike(new WeakSet())).toBe(false)
        })

        it('returns false for a Date', () => {
            expect(isMapLike(new Date())).toBe(false)
        })

        it('returns false for a RegExp', () => {
            expect(isMapLike(/test/u)).toBe(false)
        })

        it('returns true for a FifoMap with items', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2)
            expect(isMapLike(map)).toBe(true)
        })

        it('returns true for a LruMap with items', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            expect(isMapLike(map)).toBe(true)
        })

        it('returns false for object with get as string and entries as function', () => {
            const fake = {
                entries: () => [][Symbol.iterator](),
                get: 'not a function',
                size: 1,
                * [Symbol.iterator]() {
                    yield 1
                },
            }

            expect(isMapLike(fake)).toBe(false)
        })

        it('returns false for object with get as function and entries as string', () => {
            const fake = {
                entries: 'not a function',
                get: () => {},
                size: 1,
                * [Symbol.iterator]() {
                    yield 1
                },
            }

            expect(isMapLike(fake)).toBe(false)
        })
    })
})
