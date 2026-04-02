import { describe, expect, test } from 'bun:test'
import { startOfMonth } from '../../../src/times/operations'

describe('startOfMonth', () => {
    test('sets to first day of month at midnight', () => {
        const result = startOfMonth(new Date(2026, 2, 15, 14, 30, 45, 123))

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(2)
        expect(result.getDate()).toBe(1)
        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 2, 15, 14, 30, 45, 123)
        const originalTime = original.getTime()

        startOfMonth(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('returns same time when already at start of month', () => {
        const start = new Date(2026, 2, 1, 0, 0, 0, 0)
        const result = startOfMonth(start)

        expect(result.getTime()).toBe(start.getTime())
    })

    test('handles last day of month', () => {
        const result = startOfMonth(new Date(2026, 2, 31, 23, 59, 59, 999))

        expect(result.getDate()).toBe(1)
        expect(result.getHours()).toBe(0)
    })

    test('handles February in leap year', () => {
        // 2028 is a leap year
        const result = startOfMonth(new Date(2028, 1, 29, 12, 0))

        expect(result.getFullYear()).toBe(2028)
        expect(result.getMonth()).toBe(1)
        expect(result.getDate()).toBe(1)
        expect(result.getHours()).toBe(0)
    })
})
