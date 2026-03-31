import { describe, expect, it } from 'bun:test'
import { toPercent } from '@/numbers/conversions'

describe('toPercent', () => {
    it('calculates a basic percentage', () => {
        expect(toPercent(3, 10)).toBe(30)
    })

    it('calculates 100 percent', () => {
        expect(toPercent(10, 10)).toBe(100)
    })

    it('calculates 0 percent', () => {
        expect(toPercent(0, 10)).toBe(0)
    })

    it('returns 0 when total is 0', () => {
        expect(toPercent(5, 0)).toBe(0)
    })

    it('rounds to specified decimals', () => {
        expect(toPercent(1, 3, 2)).toBe(33.33)
    })

    it('rounds to 0 decimals', () => {
        expect(toPercent(1, 3, 0)).toBe(33)
    })

    it('does not round when decimals is undefined', () => {
        expect(toPercent(1, 3)).toBeCloseTo(33.333_333_333_333_336)
    })

    it('handles value greater than total', () => {
        expect(toPercent(15, 10)).toBe(150)
    })

    it('handles negative values', () => {
        expect(toPercent(-3, 10)).toBe(-30)
    })
})
