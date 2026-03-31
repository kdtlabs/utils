import { describe, expect, it } from 'bun:test'
import { intersection } from '@/arrays/set-operations'

describe('intersection', () => {
    it('returns common elements', () => {
        expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
    })

    it('returns empty array when no common elements', () => {
        expect(intersection([1, 2], [3, 4])).toEqual([])
    })

    it('returns empty array when first array is empty', () => {
        expect(intersection([], [1, 2])).toEqual([])
    })

    it('returns empty array when second array is empty', () => {
        expect(intersection([1, 2], [])).toEqual([])
    })

    it('both arrays empty', () => {
        expect(intersection([], [])).toEqual([])
    })

    it('identical arrays', () => {
        expect(intersection([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3])
    })

    it('preserves duplicates from first array if present in second', () => {
        expect(intersection([1, 1, 2, 2], [1, 2])).toEqual([1, 1, 2, 2])
    })

    it('preserves order from first array', () => {
        expect(intersection([3, 1, 2], [2, 3])).toEqual([3, 2])
    })

    it('handles nullish values', () => {
        expect(intersection([null, undefined, 1], [null, 2])).toEqual([null])
    })

    it('single element arrays with match', () => {
        expect(intersection([1], [1])).toEqual([1])
    })

    it('single element arrays without match', () => {
        expect(intersection([1], [2])).toEqual([])
    })

    it('uses reference equality for objects', () => {
        const a = { id: 1 }
        const b = { id: 1 }

        expect(intersection([a], [b])).toEqual([])
        expect(intersection([a], [a])).toEqual([a])
    })
})
