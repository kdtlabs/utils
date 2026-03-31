import { describe, expect, test } from 'bun:test'
import { endOfDay } from '../../../src/times/operations'

describe('endOfDay', () => {
    test('sets time to 23:59:59.999', () => {
        const result = endOfDay(new Date(2026, 2, 15, 14, 30, 45, 123))

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(2)
        expect(result.getDate()).toBe(15)
        expect(result.getHours()).toBe(23)
        expect(result.getMinutes()).toBe(59)
        expect(result.getSeconds()).toBe(59)
        expect(result.getMilliseconds()).toBe(999)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 2, 15, 14, 30, 45, 123)
        const originalTime = original.getTime()

        endOfDay(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('returns end of day when input is already end of day', () => {
        const eod = new Date(2026, 2, 15, 23, 59, 59, 999)
        const result = endOfDay(eod)

        expect(result.getTime()).toBe(eod.getTime())
    })

    test('handles midnight input', () => {
        const midnight = new Date(2026, 2, 15, 0, 0, 0, 0)
        const result = endOfDay(midnight)

        expect(result.getHours()).toBe(23)
        expect(result.getMinutes()).toBe(59)
        expect(result.getSeconds()).toBe(59)
        expect(result.getMilliseconds()).toBe(999)
        expect(result.getDate()).toBe(15)
    })
})
