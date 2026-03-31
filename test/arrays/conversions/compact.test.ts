import { describe, expect, it } from 'bun:test'
import { compact } from '../../../src/arrays/conversions'

describe('compact', () => {
    it('removes null and undefined', () => {
        expect(compact([1, null, 2, undefined, 3])).toEqual([1, 2, 3])
    })

    it('keeps falsy values that are not nullish', () => {
        expect(compact([0, '', false, null, undefined])).toEqual([0, '', false])
    })

    it('returns empty array for all nullish', () => {
        expect(compact([null, undefined, null])).toEqual([])
    })

    it('returns same elements when no nullish', () => {
        expect(compact([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('empty array input', () => {
        expect(compact([])).toEqual([])
    })

    it('array with only undefined', () => {
        expect(compact([undefined, undefined])).toEqual([])
    })

    it('array with only null', () => {
        expect(compact([null, null])).toEqual([])
    })

    it('keeps objects containing null properties (object itself is not nullish)', () => {
        expect(compact([{ a: null }, { a: 1 }])).toEqual([{ a: null }, { a: 1 }])
    })

    it('keeps all falsy non-nullish values: 0, empty string, false, NaN', () => {
        expect(compact([0, '', false, Number.NaN])).toEqual([0, '', false, Number.NaN])
    })

    it('single null element → empty array', () => {
        expect(compact([null])).toEqual([])
    })

    it('single non-null element → keeps it', () => {
        expect(compact([42])).toEqual([42])
    })
})
