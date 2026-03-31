import { describe, expect, it } from 'bun:test'
import { isDate } from '../../../src/core/guards'

describe('isDate', () => {
    it('returns true for a Date object', () => {
        expect(isDate(new Date())).toBe(true)
    })

    it('returns true for a Date created from string', () => {
        expect(isDate(new Date('2024-01-01'))).toBe(true)
    })

    it('returns true for an invalid Date', () => {
        expect(isDate(new Date('invalid'))).toBe(true)
    })

    it('returns false for a number', () => {
        expect(isDate(Date.now())).toBe(false)
    })

    it('returns false for a date string', () => {
        expect(isDate('2024-01-01')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isDate(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isDate(undefined)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isDate({})).toBe(false)
    })
})
