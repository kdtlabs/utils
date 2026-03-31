import { describe, expect, it } from 'bun:test'
import { sortBy } from '@/arrays/operations'

describe('sortBy', () => {
    it('sorts by a single key ascending', () => {
        const items = [{ v: 3 }, { v: 1 }, { v: 2 }]
        const result = sortBy(items, (x) => x.v)

        expect(result).toEqual([{ v: 1 }, { v: 2 }, { v: 3 }])
    })

    it('sorts by a single key descending', () => {
        const items = [{ v: 1 }, { v: 3 }, { v: 2 }]
        const result = sortBy(items, { fn: (x) => x.v, order: 'desc' })

        expect(result).toEqual([{ v: 3 }, { v: 2 }, { v: 1 }])
    })

    it('sorts by multiple keys', () => {
        const items = [
            { age: 30, name: 'b' },
            { age: 20, name: 'a' },
            { age: 30, name: 'a' },
        ]

        const result = sortBy(items, (x) => x.age, (x) => x.name)

        expect(result).toEqual([
            { age: 20, name: 'a' },
            { age: 30, name: 'a' },
            { age: 30, name: 'b' },
        ])
    })

    it('supports mixed asc/desc keys', () => {
        const items = [
            { age: 30, name: 'b' },
            { age: 20, name: 'a' },
            { age: 30, name: 'a' },
        ]

        const result = sortBy(items, { fn: (x) => x.age, order: 'desc' }, (x) => x.name)

        expect(result).toEqual([
            { age: 30, name: 'a' },
            { age: 30, name: 'b' },
            { age: 20, name: 'a' },
        ])
    })

    it('returns empty array for empty input', () => {
        expect(sortBy([], (x: number) => x)).toEqual([])
    })

    it('does not mutate original array', () => {
        const items = [{ v: 3 }, { v: 1 }]
        const copy = [...items]

        sortBy(items, (x) => x.v)
        expect(items).toEqual(copy)
    })

    it('stable sort — preserves order of equal elements', () => {
        const items = [
            { group: 1, id: 'a' },
            { group: 1, id: 'b' },
            { group: 1, id: 'c' },
        ]

        const result = sortBy(items, (x) => x.group)

        expect(result.map((x) => x.id)).toEqual(['a', 'b', 'c'])
    })

    it('sorts strings lexicographically', () => {
        const items = [{ name: 'charlie' }, { name: 'alice' }, { name: 'bob' }]
        const result = sortBy(items, (x) => x.name)

        expect(result).toEqual([{ name: 'alice' }, { name: 'bob' }, { name: 'charlie' }])
    })

    it('single element array', () => {
        expect(sortBy([{ v: 1 }], (x) => x.v)).toEqual([{ v: 1 }])
    })

    it('all elements equal across all keys — preserves original order', () => {
        const items = [{ id: 'a', v: 1 }, { id: 'b', v: 1 }, { id: 'c', v: 1 }]
        const result = sortBy(items, (x) => x.v)

        expect(result.map((x) => x.id)).toEqual(['a', 'b', 'c'])
    })

    it('no sort keys — returns copy in original order', () => {
        const items = [{ v: 3 }, { v: 1 }, { v: 2 }]
        const result = sortBy(items)

        expect(result).toEqual([{ v: 3 }, { v: 1 }, { v: 2 }])
        expect(result).not.toBe(items)
    })
})
