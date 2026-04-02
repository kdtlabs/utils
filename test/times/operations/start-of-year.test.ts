import { describe, expect, test } from 'bun:test'
import { startOfYear } from '../../../src/times/operations'

describe('startOfYear', () => {
    test('sets to January 1st at midnight', () => {
        const result = startOfYear(new Date(2026, 5, 15, 14, 30, 45, 123))

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(0)
        expect(result.getDate()).toBe(1)
        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 5, 15, 14, 30, 45, 123)
        const originalTime = original.getTime()

        startOfYear(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('returns same time when already at start of year', () => {
        const start = new Date(2026, 0, 1, 0, 0, 0, 0)
        const result = startOfYear(start)

        expect(result.getTime()).toBe(start.getTime())
    })

    test('handles December 31st', () => {
        const result = startOfYear(new Date(2026, 11, 31, 23, 59, 59, 999))

        expect(result.getMonth()).toBe(0)
        expect(result.getDate()).toBe(1)
        expect(result.getHours()).toBe(0)
    })
})
