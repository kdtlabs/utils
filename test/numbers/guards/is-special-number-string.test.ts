import { describe, expect, it } from 'bun:test'
import { isSpecialNumberString } from '../../../src/numbers/guards'

describe('isSpecialNumberString', () => {
    it('returns true for Infinity', () => {
        expect(isSpecialNumberString('Infinity')).toBe(true)
    })

    it('returns true for +Infinity', () => {
        expect(isSpecialNumberString('+Infinity')).toBe(true)
    })

    it('returns true for -Infinity', () => {
        expect(isSpecialNumberString('-Infinity')).toBe(true)
    })

    it('returns true for NaN', () => {
        expect(isSpecialNumberString('NaN')).toBe(true)
    })

    it('returns false for a numeric string', () => {
        expect(isSpecialNumberString('42')).toBe(false)
    })

    it('returns false for an empty string', () => {
        expect(isSpecialNumberString('')).toBe(false)
    })

    it('returns false for lowercase infinity', () => {
        expect(isSpecialNumberString('infinity')).toBe(false)
    })

    it('returns false for lowercase nan', () => {
        expect(isSpecialNumberString('nan')).toBe(false)
    })
})
