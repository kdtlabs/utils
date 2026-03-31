import { describe, expect, test } from 'bun:test'
import { isValidDate } from '../../../src/times/guards'

describe('isValidDate', () => {
    test('returns true for a valid Date', () => {
        expect(isValidDate(new Date())).toBe(true)
        expect(isValidDate(new Date(0))).toBe(true)
        expect(isValidDate(new Date('2026-03-15'))).toBe(true)
    })

    test('returns false for invalid Date', () => {
        expect(isValidDate(new Date('garbage'))).toBe(false)
        expect(isValidDate(new Date(Number.NaN))).toBe(false)
    })

    test('returns false for non-Date values', () => {
        expect(isValidDate(null)).toBe(false)
        expect(isValidDate(undefined)).toBe(false)
        expect(isValidDate(123)).toBe(false)
        expect(isValidDate('2026-03-15')).toBe(false)
        expect(isValidDate({})).toBe(false)
        expect(isValidDate([])).toBe(false)
    })

    test('narrows type', () => {
        const value: unknown = new Date()

        if (isValidDate(value)) {
            expect(value.getTime()).toBeGreaterThanOrEqual(0)
        }
    })
})
