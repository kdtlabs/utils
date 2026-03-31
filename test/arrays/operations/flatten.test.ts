import { describe, expect, it } from 'bun:test'
import { flatten } from '../../../src/arrays/operations'

describe('flatten', () => {
    it('flattens nested arrays one level', () => {
        expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4])
    })

    it('flattens mix of values and arrays', () => {
        expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4])
    })

    it('returns empty array for undefined', () => {
        expect(flatten()).toEqual([])
    })

    it('returns empty array for null', () => {
        expect(flatten(null)).toEqual([])
    })

    it('returns empty array when called with no args', () => {
        expect(flatten()).toEqual([])
    })

    it('handles empty array', () => {
        expect(flatten([])).toEqual([])
    })

    it('handles flat array (no nesting)', () => {
        expect(flatten([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('wraps single non-array value', () => {
        expect(flatten(42)).toEqual([42])
    })

    it('preserves nullish elements inside arrays', () => {
        expect(flatten<number | null | undefined>([null, [undefined, 1]])).toEqual([null, undefined, 1])
    })

    it('handles Set input (iterable)', () => {
        expect(flatten(new Set([1, 2, 3]))).toEqual([1, 2, 3])
    })
})
