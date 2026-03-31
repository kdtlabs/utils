import { describe, expect, it } from 'bun:test'
import { isInRange } from '../../../src/numbers/ranges'

describe('isInRange', () => {
    it('returns true when value is within inclusive range', () => {
        expect(isInRange(5, 1, 10)).toBe(true)
    })

    it('returns true when value equals min with inclusive', () => {
        expect(isInRange(1, 1, 10)).toBe(true)
    })

    it('returns true when value equals max with inclusive', () => {
        expect(isInRange(10, 1, 10)).toBe(true)
    })

    it('returns false when value equals min with exclusive', () => {
        expect(isInRange(1, 1, 10, false)).toBe(false)
    })

    it('returns false when value equals max with exclusive', () => {
        expect(isInRange(10, 1, 10, false)).toBe(false)
    })

    it('returns false when value is below range', () => {
        expect(isInRange(0, 1, 10)).toBe(false)
    })

    it('returns false when value is above range', () => {
        expect(isInRange(11, 1, 10)).toBe(false)
    })

    it('works with bigint values', () => {
        expect(isInRange(5n, 1n, 10n)).toBe(true)
    })

    it('works with negative ranges', () => {
        expect(isInRange(-5, -10, -1)).toBe(true)
    })
})
