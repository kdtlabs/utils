import { describe, expect, it } from 'bun:test'
import { desc } from '../../../src/arrays/comparators'

describe('desc', () => {
    it('sorts numbers descending', () => {
        expect([1, 3, 2].sort(desc())).toEqual([3, 2, 1])
    })

    it('sorts negative numbers descending', () => {
        expect([5, -3, 0, -1, 2].sort(desc())).toEqual([5, 2, 0, -1, -3])
    })

    it('sorts bigints descending', () => {
        expect([1n, 3n, 2n].sort(desc())).toEqual([3n, 2n, 1n])
    })

    it('sorts strings alphabetically descending', () => {
        expect(['apple', 'cherry', 'banana'].sort(desc())).toEqual(['cherry', 'banana', 'apple'])
    })

    it('sorts strings with natural type descending', () => {
        expect(['file10', 'file2', 'file1'].sort(desc('natural'))).toEqual(['file10', 'file2', 'file1'])
    })

    it('sorts strings by length descending', () => {
        expect(['hi', 'hello', 'hey'].sort(desc('length'))).toEqual(['hello', 'hey', 'hi'])
    })

    it('handles empty array', () => {
        expect(([] as number[]).sort(desc())).toEqual([])
    })

    it('handles single element', () => {
        expect([42].sort(desc())).toEqual([42])
    })

    it('handles all equal elements', () => {
        expect([1, 1, 1].sort(desc())).toEqual([1, 1, 1])
    })

    it('returns positive for a < b', () => {
        expect(desc()(1, 2)).toBeGreaterThan(0)
    })

    it('returns negative for a > b', () => {
        expect(desc()(2, 1)).toBeLessThan(0)
    })

    it('returns 0 for equal values', () => {
        expect(desc()(1, 1)).toBe(0)
    })

    it('is inverse of asc', () => {
        const result = [3, 1, 4, 1, 5, 9, 2, 6].toSorted(desc())

        expect(result).toEqual([9, 6, 5, 4, 3, 2, 1, 1])
    })
})
