import { describe, expect, it } from 'bun:test'
import { groupBy } from '../../../src/arrays/operations'

describe('groupBy', () => {
    it('groups items by key function', () => {
        const result = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? 'even' : 'odd'))

        expect(result).toEqual({ even: [2, 4], odd: [1, 3, 5] })
    })

    it('returns empty object for empty array', () => {
        expect(groupBy([], (x: number) => x)).toEqual({})
    })

    it('single group when all keys are the same', () => {
        expect(groupBy([1, 2, 3], () => 'all')).toEqual({ all: [1, 2, 3] })
    })

    it('each item in its own group', () => {
        expect(groupBy(['a', 'b', 'c'], (x) => x)).toEqual({ a: ['a'], b: ['b'], c: ['c'] })
    })

    it('preserves insertion order within groups', () => {
        const items = [
            { group: 1, name: 'a' },
            { group: 2, name: 'b' },
            { group: 1, name: 'c' },
        ]

        const result = groupBy(items, (item) => item.group)

        expect(result[1]).toEqual([{ group: 1, name: 'a' }, { group: 1, name: 'c' }])
        expect(result[2]).toEqual([{ group: 2, name: 'b' }])
    })

    it('works with string keys from number input', () => {
        const result = groupBy([10, 20, 15, 25], (n) => (n >= 20 ? 'high' : 'low'))

        expect(result).toEqual({ high: [20, 25], low: [10, 15] })
    })

    it('works with numeric keys', () => {
        const items = [{ g: 2, v: 'a' }, { g: 1, v: 'b' }, { g: 2, v: 'c' }]
        const result = groupBy(items, (x) => x.g)

        expect(result[1]).toEqual([{ g: 1, v: 'b' }])
        expect(result[2]).toEqual([{ g: 2, v: 'a' }, { g: 2, v: 'c' }])
    })

    it('array with null and undefined as items', () => {
        const items = [null, undefined, null]
        const result = groupBy(items, (x) => (x === null ? 'null' : 'undefined'))

        expect(result).toEqual({ null: [null, null], undefined: [undefined] })
    })

    it('keyFn returning same key for all items produces single large group', () => {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const result = groupBy(items, () => 'all')

        expect(result).toEqual({ all: items })
        expect(result.all.length).toBe(10)
    })
})
