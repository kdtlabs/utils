import { describe, expect, test } from 'bun:test'
import { endOfHour } from '../../../src/times/operations'

describe('endOfHour', () => {
    test('sets minutes, seconds, and milliseconds to max', () => {
        const result = endOfHour(new Date(2026, 2, 15, 14, 30, 45, 123))

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(2)
        expect(result.getDate()).toBe(15)
        expect(result.getHours()).toBe(14)
        expect(result.getMinutes()).toBe(59)
        expect(result.getSeconds()).toBe(59)
        expect(result.getMilliseconds()).toBe(999)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 2, 15, 14, 30, 45, 123)
        const originalTime = original.getTime()

        endOfHour(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('returns same time when already at end of hour', () => {
        const end = new Date(2026, 2, 15, 14, 59, 59, 999)
        const result = endOfHour(end)

        expect(result.getTime()).toBe(end.getTime())
    })

    test('handles midnight hour', () => {
        const result = endOfHour(new Date(2026, 2, 15, 0, 0, 0, 0))

        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(59)
        expect(result.getSeconds()).toBe(59)
        expect(result.getMilliseconds()).toBe(999)
    })

    test('handles last hour of day', () => {
        const result = endOfHour(new Date(2026, 2, 15, 23, 0, 0, 0))

        expect(result.getHours()).toBe(23)
        expect(result.getMinutes()).toBe(59)
        expect(result.getSeconds()).toBe(59)
        expect(result.getMilliseconds()).toBe(999)
    })
})
