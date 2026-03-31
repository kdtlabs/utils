import { describe, expect, it } from 'bun:test'
import { wrap } from '@/arrays/conversions'

describe('wrap', () => {
    it('wraps a non-array value in an array', () => {
        expect(wrap(1)).toEqual([1])
    })

    it('returns the array as-is if already an array', () => {
        const arr = [1, 2, 3]

        expect(wrap(arr)).toBe(arr)
    })

    it('wraps string in an array', () => {
        expect(wrap('hello')).toEqual(['hello'])
    })

    it('wraps object in an array', () => {
        expect(wrap({ a: 1 })).toEqual([{ a: 1 }])
    })

    it('wraps null in an array', () => {
        expect(wrap(null)).toEqual([null])
    })

    it('wraps undefined in an array', () => {
        expect(wrap(undefined)).toEqual([undefined])
    })

    it('wraps 0 in an array', () => {
        expect(wrap(0)).toEqual([0])
    })

    it('wraps empty string in an array', () => {
        expect(wrap('')).toEqual([''])
    })

    it('wraps false in an array', () => {
        expect(wrap(false)).toEqual([false])
    })

    it('returns nested array as-is (array of arrays)', () => {
        const nested = [[1, 2]]
        expect(wrap(nested)).toBe(nested)
    })

    it('returns empty array as-is', () => {
        const empty: never[] = []
        expect(wrap(empty)).toBe(empty)
    })
})
