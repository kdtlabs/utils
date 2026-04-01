import { describe, expect, it } from 'bun:test'
import { asc } from '../../../src/arrays/comparators'

describe('asc', () => {
    it('sorts numbers ascending', () => {
        expect([3, 1, 2].sort(asc())).toEqual([1, 2, 3])
    })

    it('sorts negative numbers', () => {
        expect([5, -3, 0, -1, 2].sort(asc())).toEqual([-3, -1, 0, 2, 5])
    })

    it('sorts bigints ascending', () => {
        expect([3n, 1n, 2n].sort(asc())).toEqual([1n, 2n, 3n])
    })

    it('sorts strings alphabetically by default', () => {
        expect(['banana', 'apple', 'cherry'].sort(asc())).toEqual(['apple', 'banana', 'cherry'])
    })

    it('sorts strings case-sensitively (uppercase before lowercase)', () => {
        const result = ['b', 'A', 'a', 'B'].sort(asc())

        expect(result).toEqual(['A', 'B', 'a', 'b'])
    })

    it('sorts strings with natural type', () => {
        expect(['file10', 'file2', 'file1'].sort(asc('natural'))).toEqual(['file1', 'file2', 'file10'])
    })

    it('sorts strings by length', () => {
        expect(['hello', 'hi', 'hey'].sort(asc('length'))).toEqual(['hi', 'hey', 'hello'])
    })

    it('sorts strings by length — equal lengths preserve order', () => {
        const result = ['abc', 'def', 'ghi'].sort(asc('length'))

        expect(result).toEqual(['abc', 'def', 'ghi'])
    })

    it('sorts strings with alphabetical type explicitly', () => {
        expect(['c', 'a', 'b'].sort(asc('alphabetical'))).toEqual(['a', 'b', 'c'])
    })

    it('handles empty array', () => {
        expect(([] as number[]).sort(asc())).toEqual([])
    })

    it('handles single element', () => {
        expect([42].sort(asc())).toEqual([42])
    })

    it('handles all equal elements', () => {
        expect([1, 1, 1].sort(asc())).toEqual([1, 1, 1])
    })

    it('returns negative for a < b', () => {
        expect(asc()(1, 2)).toBeLessThan(0)
    })

    it('returns positive for a > b', () => {
        expect(asc()(2, 1)).toBeGreaterThan(0)
    })

    it('returns 0 for equal values', () => {
        expect(asc()(1, 1)).toBe(0)
    })

    it('sorts floating point numbers', () => {
        expect([1.5, 1.1, 1.3].sort(asc())).toEqual([1.1, 1.3, 1.5])
    })

    it('natural sort handles pure numeric strings', () => {
        expect(['10', '2', '1', '20'].sort(asc('natural'))).toEqual(['1', '2', '10', '20'])
    })

    it('length sort with empty strings', () => {
        expect(['abc', '', 'a'].sort(asc('length'))).toEqual(['', 'a', 'abc'])
    })
})
