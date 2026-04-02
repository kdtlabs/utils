import { describe, expect, test } from 'bun:test'
import { startOfWeek } from '../../../src/times/operations'
import { DayOfWeek } from '../../../src/times/types'

describe('startOfWeek', () => {
    test('defaults to Monday as start of week', () => {
        // Wednesday 2026-03-18
        const result = startOfWeek(new Date(2026, 2, 18, 14, 30, 45, 123))

        expect(result.getDay()).toBe(DayOfWeek.MONDAY)
        expect(result.getDate()).toBe(16)
        expect(result.getHours()).toBe(0)
        expect(result.getMinutes()).toBe(0)
        expect(result.getSeconds()).toBe(0)
        expect(result.getMilliseconds()).toBe(0)
    })

    test('supports Sunday as start of week', () => {
        // Wednesday 2026-03-18
        const result = startOfWeek(new Date(2026, 2, 18, 14, 30), { weekStartsOn: DayOfWeek.SUNDAY })

        expect(result.getDay()).toBe(DayOfWeek.SUNDAY)
        expect(result.getDate()).toBe(15)
        expect(result.getHours()).toBe(0)
    })

    test('supports Saturday as start of week', () => {
        // Wednesday 2026-03-18
        const result = startOfWeek(new Date(2026, 2, 18), { weekStartsOn: DayOfWeek.SATURDAY })

        expect(result.getDay()).toBe(DayOfWeek.SATURDAY)
        expect(result.getDate()).toBe(14)
    })

    test('returns same day when input is already start of week', () => {
        // Monday 2026-03-16
        const monday = new Date(2026, 2, 16, 10, 0)
        const result = startOfWeek(monday)

        expect(result.getDate()).toBe(16)
        expect(result.getHours()).toBe(0)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 2, 18, 14, 30, 45, 123)
        const originalTime = original.getTime()

        startOfWeek(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('handles crossing month boundary backward', () => {
        // Sunday 2026-03-01
        const result = startOfWeek(new Date(2026, 2, 1))

        expect(result.getMonth()).toBe(1) // February
        expect(result.getDate()).toBe(23)
        expect(result.getDay()).toBe(DayOfWeek.MONDAY)
    })

    test('handles crossing year boundary backward', () => {
        // Thursday 2026-01-01
        const result = startOfWeek(new Date(2026, 0, 1))

        expect(result.getFullYear()).toBe(2025)
        expect(result.getMonth()).toBe(11) // December
        expect(result.getDate()).toBe(29)
        expect(result.getDay()).toBe(DayOfWeek.MONDAY)
    })
})
