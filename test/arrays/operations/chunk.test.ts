import { describe, expect, it } from 'bun:test'
import { chunk } from '../../../src/arrays/operations'

describe('chunk', () => {
    it('splits array into chunks of given size', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    it('returns empty array for empty input', () => {
        expect(chunk([], 3)).toEqual([])
    })

    it('returns single chunk when size >= array length', () => {
        expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]])
    })

    it('returns single chunk when size equals array length', () => {
        expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]])
    })

    it('each element in its own chunk when size is 1', () => {
        expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]])
    })

    it('handles last chunk being smaller', () => {
        expect(chunk([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]])
    })

    it('single element array', () => {
        expect(chunk([42], 3)).toEqual([[42]])
    })

    it('throws RangeError when size is 0', () => {
        expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError)
    })

    it('throws RangeError when size is negative', () => {
        expect(() => chunk([1, 2, 3], -1)).toThrow(RangeError)
    })

    it('throws RangeError when size is NaN', () => {
        expect(() => chunk([1, 2, 3], Number.NaN)).toThrow(RangeError)
    })

    it('throws RangeError when size is Infinity', () => {
        expect(() => chunk([1, 2, 3], Infinity)).toThrow(RangeError)
    })

    it('floors fractional size', () => {
        expect(chunk([1, 2, 3, 4, 5], 2.7)).toEqual([[1, 2], [3, 4], [5]])
    })

    it('throws RangeError when size is -Infinity', () => {
        expect(() => chunk([1, 2, 3], -Infinity)).toThrow(RangeError)
    })
})
