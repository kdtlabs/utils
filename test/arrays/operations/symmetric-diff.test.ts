import { describe, expect, it } from 'bun:test'
import { symmetricDiff } from '@/arrays/set-operations'

describe('symmetricDiff', () => {
    it('returns elements in either array but not both', () => {
        expect(symmetricDiff([1, 2, 3], [2, 3, 4])).toEqual([1, 4])
    })

    it('returns all elements when no overlap', () => {
        expect(symmetricDiff([1, 2], [3, 4])).toEqual([1, 2, 3, 4])
    })

    it('returns empty array when arrays are identical', () => {
        expect(symmetricDiff([1, 2, 3], [1, 2, 3])).toEqual([])
    })

    it('returns second array when first is empty', () => {
        expect(symmetricDiff([], [1, 2])).toEqual([1, 2])
    })

    it('returns first array when second is empty', () => {
        expect(symmetricDiff([1, 2], [])).toEqual([1, 2])
    })

    it('both arrays empty', () => {
        expect(symmetricDiff([], [])).toEqual([])
    })

    it('single element arrays with match', () => {
        expect(symmetricDiff([1], [1])).toEqual([])
    })

    it('single element arrays without match', () => {
        expect(symmetricDiff([1], [2])).toEqual([1, 2])
    })

    it('preserves duplicates from both sides', () => {
        expect(symmetricDiff([1, 1, 2], [2, 3, 3])).toEqual([1, 1, 3, 3])
    })

    it('handles nullish values', () => {
        expect(symmetricDiff([null, 1], [undefined, 1])).toEqual([null, undefined])
    })

    it('uses reference equality for objects', () => {
        const a = { id: 1 }
        const b = { id: 1 }

        expect(symmetricDiff([a], [b])).toEqual([a, b])
    })
})
