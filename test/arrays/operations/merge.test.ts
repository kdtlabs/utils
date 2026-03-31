import { describe, expect, it } from 'bun:test'
import { merge } from '../../../src/arrays/operations'

describe('merge', () => {
    it('merges multiple arrays', () => {
        expect(merge([1, 2], [3, 4])).toEqual([1, 2, 3, 4])
    })

    it('merges three arrays', () => {
        expect(merge([1], [2], [3])).toEqual([1, 2, 3])
    })

    it('returns empty array when no arguments', () => {
        expect(merge()).toEqual([])
    })

    it('handles single array', () => {
        expect(merge([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('handles null arguments', () => {
        expect(merge(null, [1, 2])).toEqual([1, 2])
    })

    it('handles undefined arguments', () => {
        expect(merge(undefined, [3, 4])).toEqual([3, 4])
    })

    it('handles mix of null, undefined, and arrays', () => {
        expect(merge(null, [1], undefined, [2], null)).toEqual([1, 2])
    })

    it('handles empty arrays', () => {
        expect(merge([], [], [])).toEqual([])
    })

    it('handles single values (non-array)', () => {
        expect(merge(1, 2, 3)).toEqual([1, 2, 3])
    })

    it('handles mix of single values and arrays', () => {
        expect(merge(1, [2, 3], 4)).toEqual([1, 2, 3, 4])
    })

    it('preserves nullish elements inside arrays', () => {
        expect(merge([null, undefined], [1])).toEqual([null, undefined, 1])
    })

    it('preserves duplicates', () => {
        expect(merge([1, 2], [2, 3])).toEqual([1, 2, 2, 3])
    })
})
