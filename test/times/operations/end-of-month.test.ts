import { describe, expect, test } from 'bun:test'
import { endOfMonth } from '../../../src/times/operations'

describe('endOfMonth', () => {
    test('sets to last day of month at end of day', () => {
        const result = endOfMonth(new Date(2026, 2, 15, 14, 30, 45, 123))

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(2)
        expect(result.getDate()).toBe(31)
        expect(result.getHours()).toBe(23)
        expect(result.getMinutes()).toBe(59)
        expect(result.getSeconds()).toBe(59)
        expect(result.getMilliseconds()).toBe(999)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 2, 15, 14, 30, 45, 123)
        const originalTime = original.getTime()

        endOfMonth(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('returns same time when already at end of month', () => {
        const end = new Date(2026, 2, 31, 23, 59, 59, 999)
        const result = endOfMonth(end)

        expect(result.getTime()).toBe(end.getTime())
    })

    test('handles February (28 days)', () => {
        const result = endOfMonth(new Date(2026, 1, 10))

        expect(result.getMonth()).toBe(1)
        expect(result.getDate()).toBe(28)
    })

    test('handles February in leap year (29 days)', () => {
        const result = endOfMonth(new Date(2028, 1, 10))

        expect(result.getMonth()).toBe(1)
        expect(result.getDate()).toBe(29)
    })

    test('handles 30-day month', () => {
        const result = endOfMonth(new Date(2026, 3, 10)) // April

        expect(result.getMonth()).toBe(3)
        expect(result.getDate()).toBe(30)
    })

    test('handles first day of month', () => {
        const result = endOfMonth(new Date(2026, 2, 1, 0, 0, 0, 0))

        expect(result.getDate()).toBe(31)
        expect(result.getHours()).toBe(23)
    })
})
