import { describe, expect, it } from 'bun:test'
import { isNumber } from '../../../src/core/guards'

describe('isNumber', () => {
    it('returns true for an integer', () => {
        expect(isNumber(42)).toBe(true)
    })

    it('returns true for a float', () => {
        expect(isNumber(3.14)).toBe(true)
    })

    it('returns true for NaN', () => {
        expect(isNumber(Number.NaN)).toBe(true)
    })

    it('returns true for Infinity', () => {
        expect(isNumber(Infinity)).toBe(true)
    })

    it('returns false for a numeric string', () => {
        expect(isNumber('42')).toBe(false)
    })
})
