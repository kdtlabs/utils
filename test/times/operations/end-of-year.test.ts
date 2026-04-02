import { describe, expect, test } from 'bun:test'
import { endOfYear } from '../../../src/times/operations'

describe('endOfYear', () => {
    test('sets to December 31st at end of day', () => {
        const result = endOfYear(new Date(2026, 5, 15, 14, 30, 45, 123))

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(11)
        expect(result.getDate()).toBe(31)
        expect(result.getHours()).toBe(23)
        expect(result.getMinutes()).toBe(59)
        expect(result.getSeconds()).toBe(59)
        expect(result.getMilliseconds()).toBe(999)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 5, 15, 14, 30, 45, 123)
        const originalTime = original.getTime()

        endOfYear(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('returns same time when already at end of year', () => {
        const end = new Date(2026, 11, 31, 23, 59, 59, 999)
        const result = endOfYear(end)

        expect(result.getTime()).toBe(end.getTime())
    })

    test('handles January 1st', () => {
        const result = endOfYear(new Date(2026, 0, 1, 0, 0, 0, 0))

        expect(result.getMonth()).toBe(11)
        expect(result.getDate()).toBe(31)
        expect(result.getHours()).toBe(23)
    })
})
