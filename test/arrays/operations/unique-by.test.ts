import { describe, expect, it } from 'bun:test'
import { uniqueBy } from '../../../src/arrays/set-operations'

describe('uniqueBy', () => {
    it('removes duplicates using equality function', () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }]
        const result = uniqueBy(items, (a, b) => a.id === b.id)

        expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    })

    it('returns empty array for empty input', () => {
        expect(uniqueBy([], (a, b) => a === b)).toEqual([])
    })

    it('keeps first occurrence', () => {
        const items = [{ id: 1, v: 'first' }, { id: 1, v: 'second' }]
        const result = uniqueBy(items, (a, b) => a.id === b.id)

        expect(result).toEqual([{ id: 1, v: 'first' }])
    })

    it('returns same elements when all unique', () => {
        const items = [1, 2, 3]
        const result = uniqueBy(items, (a, b) => a === b)

        expect(result).toEqual([1, 2, 3])
    })

    it('single element array', () => {
        expect(uniqueBy([42], (a, b) => a === b)).toEqual([42])
    })

    it('array with nullish elements', () => {
        const items = [null, undefined, null, undefined]
        const result = uniqueBy(items, (a, b) => a === b)

        expect(result).toEqual([null, undefined])
    })

    it('equalFn always returns true — only first element kept', () => {
        const result = uniqueBy([1, 2, 3, 4], () => true)

        expect(result).toEqual([1])
    })

    it('equalFn always returns false — all elements kept', () => {
        const result = uniqueBy([1, 2, 3, 4], () => false)

        expect(result).toEqual([1, 2, 3, 4])
    })
})
