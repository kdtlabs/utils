import { describe, expect, it } from 'bun:test'
import { FifoMap } from '../../../src/collections/fifo-map'
import { FifoSet } from '../../../src/collections/fifo-set'
import { isEmptyCollection } from '../../../src/collections/guards'
import { LruMap } from '../../../src/collections/lru-map'
import { LruSet } from '../../../src/collections/lru-set'

describe('isEmptyCollection', () => {
    it('returns true for an empty Set', () => {
        expect(isEmptyCollection(new Set())).toBe(true)
    })

    it('returns false for a non-empty Set', () => {
        expect(isEmptyCollection(new Set([1, 2, 3]))).toBe(false)
    })

    it('returns true for an empty Map', () => {
        expect(isEmptyCollection(new Map())).toBe(true)
    })

    it('returns false for a non-empty Map', () => {
        expect(isEmptyCollection(new Map([['a', 1]]))).toBe(false)
    })

    it('returns true for a custom collection with size 0', () => {
        const custom = {
            size: 0,
            * [Symbol.iterator]() {},
        }

        expect(isEmptyCollection(custom)).toBe(true)
    })

    it('returns false for a custom collection with size > 0', () => {
        const custom = {
            size: 5,
            * [Symbol.iterator]() {
                yield 1
            },
        }

        expect(isEmptyCollection(custom)).toBe(false)
    })

    describe('edge cases', () => {
        it('returns true for an empty FifoSet', () => {
            expect(isEmptyCollection(new FifoSet())).toBe(true)
        })

        it('returns false for a non-empty FifoSet', () => {
            const set = new FifoSet<number>()
            set.add(1)
            expect(isEmptyCollection(set)).toBe(false)
        })

        it('returns true for an empty FifoMap', () => {
            expect(isEmptyCollection(new FifoMap())).toBe(true)
        })

        it('returns false for a non-empty FifoMap', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            expect(isEmptyCollection(map)).toBe(false)
        })

        it('returns true for an empty LruSet', () => {
            expect(isEmptyCollection(new LruSet())).toBe(true)
        })

        it('returns false for a non-empty LruSet', () => {
            const set = new LruSet<number>()
            set.add(1)
            expect(isEmptyCollection(set)).toBe(false)
        })

        it('returns true for an empty LruMap', () => {
            expect(isEmptyCollection(new LruMap())).toBe(true)
        })

        it('returns false for a non-empty LruMap', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            expect(isEmptyCollection(map)).toBe(false)
        })
    })
})
