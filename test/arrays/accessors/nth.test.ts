import { describe, expect, it } from 'bun:test'
import { nth } from '../../../src/arrays/accessors'

describe('nth', () => {
    it('returns element at positive index', () => {
        expect(nth([10, 20, 30], 1)).toBe(20)
    })

    it('returns first element at index 0', () => {
        expect(nth([10, 20, 30], 0)).toBe(10)
    })

    it('returns element at negative index', () => {
        expect(nth([10, 20, 30], -1)).toBe(30)
        expect(nth([10, 20, 30], -2)).toBe(20)
        expect(nth([10, 20, 30], -3)).toBe(10)
    })

    it('returns undefined for out-of-bounds positive index', () => {
        expect(nth([1, 2], 5)).toBeUndefined()
    })

    it('returns undefined for out-of-bounds negative index', () => {
        expect(nth([1, 2], -3)).toBeUndefined()
    })

    it('returns undefined for empty array', () => {
        expect(nth([], 0)).toBeUndefined()
    })

    it('fractional index is floored by Array.at', () => {
        expect(nth([10, 20, 30], 1.5)).toBe(20)
    })

    it('NaN index returns first element (Array.at coerces to 0)', () => {
        expect(nth([10, 20, 30], Number.NaN)).toBe(10)
    })

    it('Infinity index returns undefined', () => {
        expect(nth([10, 20, 30], Infinity)).toBeUndefined()
    })

    it('-Infinity index returns undefined', () => {
        expect(nth([10, 20, 30], -Infinity)).toBeUndefined()
    })

    it('very large negative index returns undefined', () => {
        expect(nth([1, 2, 3], -9999)).toBeUndefined()
    })

    it('returns null when element is null', () => {
        expect(nth([null, 1, 2], 0)).toBeNull()
    })

    it('returns undefined when element is undefined', () => {
        expect(nth([undefined, 1, 2], 0)).toBeUndefined()
    })

    it('sparse array — empty slot returns undefined', () => {
        // eslint-disable-next-line no-sparse-arrays
        expect(nth([1, , 3] as number[], 1)).toBeUndefined()
    })
})
