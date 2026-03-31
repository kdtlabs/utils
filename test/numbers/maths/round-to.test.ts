import { describe, expect, it } from 'bun:test'
import { roundTo } from '@/numbers/maths'

describe('roundTo', () => {
    it('rounds to 1 decimal place', () => {
        expect(roundTo(3.456, 1)).toBe(3.5)
    })

    it('rounds to 2 decimal places', () => {
        expect(roundTo(3.456, 2)).toBe(3.46)
    })

    it('rounds to 0 decimal places', () => {
        expect(roundTo(3.5, 0)).toBe(4)
    })

    it('fixes floating point errors', () => {
        expect(roundTo(0.1 + 0.2, 1)).toBe(0.3)
    })

    it('handles negative decimals for rounding to tens', () => {
        expect(roundTo(1234, -2)).toBe(1200)
    })

    it('handles negative decimals for rounding to hundreds', () => {
        expect(roundTo(1550, -3)).toBe(2000)
    })

    it('returns the value when already rounded', () => {
        expect(roundTo(5, 2)).toBe(5)
    })

    it('handles negative numbers', () => {
        expect(roundTo(-3.456, 2)).toBe(-3.46)
    })
})
