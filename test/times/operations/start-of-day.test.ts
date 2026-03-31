import { describe, expect, test } from 'bun:test'
import { startOfDay } from '@/times/operations'

describe('startOfDay', () => {
    test('sets time to midnight', () => {
        const result = startOfDay(new Date(2026, 2, 15, 14, 30, 45, 123))

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(2)
        expect(result.getDate()).toBe(15)
        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 2, 15, 14, 30, 45, 123)
        const originalTime = original.getTime()

        startOfDay(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('returns midnight when input is already midnight', () => {
        const midnight = new Date(2026, 2, 15, 0, 0, 0, 0)
        const result = startOfDay(midnight)

        expect(result.getTime()).toBe(midnight.getTime())
    })

    test('handles end of day input', () => {
        const endOfDay = new Date(2026, 2, 15, 23, 59, 59, 999)
        const result = startOfDay(endOfDay)

        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
        expect(result.getDate()).toBe(15)
    })
})
