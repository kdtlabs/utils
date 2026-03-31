import { describe, expect, it } from 'bun:test'
import { diff } from '../../../src/arrays/set-operations'

describe('diff', () => {
    it('returns elements in first array not in second', () => {
        expect(diff([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
    })

    it('returns empty array when all elements are in second', () => {
        expect(diff([1, 2], [1, 2, 3])).toEqual([])
    })

    it('returns first array when no overlap', () => {
        expect(diff([1, 2], [3, 4])).toEqual([1, 2])
    })

    it('returns empty array when first array is empty', () => {
        expect(diff([], [1, 2])).toEqual([])
    })

    it('returns first array when second array is empty', () => {
        expect(diff([1, 2, 3], [])).toEqual([1, 2, 3])
    })

    it('both arrays empty', () => {
        expect(diff([], [])).toEqual([])
    })

    it('identical arrays', () => {
        expect(diff([1, 2, 3], [1, 2, 3])).toEqual([])
    })

    it('preserves duplicates from first array', () => {
        expect(diff([1, 1, 2, 2], [2])).toEqual([1, 1])
    })

    it('preserves order', () => {
        expect(diff([3, 1, 2], [2])).toEqual([3, 1])
    })

    it('handles nullish values', () => {
        expect(diff([null, undefined, 1], [null])).toEqual([undefined, 1])
    })

    it('uses reference equality for objects', () => {
        const a = { id: 1 }
        const b = { id: 1 }

        expect(diff([a], [b])).toEqual([a])
        expect(diff([a], [a])).toEqual([])
    })
})
