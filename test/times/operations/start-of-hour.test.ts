import { describe, expect, test } from 'bun:test'
import { startOfHour } from '../../../src/times/operations'

describe('startOfHour', () => {
    test('zeros minutes, seconds, and milliseconds', () => {
        const result = startOfHour(new Date(2026, 2, 15, 14, 30, 45, 123))

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(2)
        expect(result.getDate()).toBe(15)
        expect(result.getHours()).toBe(14)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 2, 15, 14, 30, 45, 123)
        const originalTime = original.getTime()

        startOfHour(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('returns same time when already at start of hour', () => {
        const start = new Date(2026, 2, 15, 14, 0, 0, 0)
        const result = startOfHour(start)

        expect(result.getTime()).toBe(start.getTime())
    })

    test('handles midnight hour', () => {
        const result = startOfHour(new Date(2026, 2, 15, 0, 45, 30, 500))

        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })

    test('handles last hour of day', () => {
        const result = startOfHour(new Date(2026, 2, 15, 23, 59, 59, 999))

        expect(result.getHours()).toBe(23)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })
})
