import { describe, expect, it } from 'bun:test'
import { isValidRange } from '@/numbers/ranges'

describe('isValidRange', () => {
    it('returns true for a valid inclusive range', () => {
        expect(isValidRange(1, 10)).toBe(true)
    })

    it('returns true when start equals end with inclusive', () => {
        expect(isValidRange(5, 5)).toBe(true)
    })

    it('returns false when start equals end with exclusive', () => {
        expect(isValidRange(5, 5, false)).toBe(false)
    })

    it('returns false when start is greater than end', () => {
        expect(isValidRange(10, 1)).toBe(false)
    })

    it('returns false when start is below min', () => {
        expect(isValidRange(1, 10, true, 5)).toBe(false)
    })

    it('returns false when end is above max', () => {
        expect(isValidRange(1, 10, true, undefined, 5)).toBe(false)
    })

    it('returns true when within min and max bounds', () => {
        expect(isValidRange(3, 7, true, 1, 10)).toBe(true)
    })

    it('works with bigint values', () => {
        expect(isValidRange(1n, 10n)).toBe(true)
    })

    it('works with bigint values and bounds', () => {
        expect(isValidRange(1n, 10n, true, 0n, 100n)).toBe(true)
    })
})
