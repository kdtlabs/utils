import { describe, expect, it } from 'bun:test'
import { isPercentage } from '@/numbers/guards'

describe('isPercentage', () => {
    it('returns true for 0', () => {
        expect(isPercentage(0)).toBe(true)
    })

    it('returns true for 100', () => {
        expect(isPercentage(100)).toBe(true)
    })

    it('returns true for 50', () => {
        expect(isPercentage(50)).toBe(true)
    })

    it('returns true for a decimal percentage', () => {
        expect(isPercentage(33.33)).toBe(true)
    })

    it('returns false for a negative number', () => {
        expect(isPercentage(-1)).toBe(false)
    })

    it('returns false for a number greater than 100', () => {
        expect(isPercentage(101)).toBe(false)
    })

    it('returns false for NaN', () => {
        expect(isPercentage(Number.NaN)).toBe(false)
    })

    it('returns false for Infinity', () => {
        expect(isPercentage(Infinity)).toBe(false)
    })
})
