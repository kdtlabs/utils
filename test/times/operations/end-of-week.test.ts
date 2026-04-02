import { describe, expect, test } from 'bun:test'
import { endOfWeek } from '../../../src/times/operations'
import { DayOfWeek } from '../../../src/times/types'

describe('endOfWeek', () => {
    test('defaults to Sunday as end of week (Monday start)', () => {
        // Wednesday 2026-03-18
        const result = endOfWeek(new Date(2026, 2, 18, 14, 30, 45, 123))

        expect(result.getDay()).toBe(DayOfWeek.SUNDAY)
        expect(result.getDate()).toBe(22)
        expect(result.getHours()).toBe(23)
        expect(result.getMinutes()).toBe(59)
        expect(result.getSeconds()).toBe(59)
        expect(result.getMilliseconds()).toBe(999)
    })

    test('supports Sunday as start of week (Saturday end)', () => {
        // Wednesday 2026-03-18
        const result = endOfWeek(new Date(2026, 2, 18, 14, 30), { weekStartsOn: DayOfWeek.SUNDAY })

        expect(result.getDay()).toBe(DayOfWeek.SATURDAY)
        expect(result.getDate()).toBe(21)
        expect(result.getHours()).toBe(23)
    })

    test('supports Saturday as start of week (Friday end)', () => {
        // Wednesday 2026-03-18
        const result = endOfWeek(new Date(2026, 2, 18), { weekStartsOn: DayOfWeek.SATURDAY })

        expect(result.getDay()).toBe(DayOfWeek.FRIDAY)
        expect(result.getDate()).toBe(20)
    })

    test('returns same day when input is already end of week', () => {
        // Sunday 2026-03-22 (end of week for Monday start)
        const sunday = new Date(2026, 2, 22, 10, 0)
        const result = endOfWeek(sunday)

        expect(result.getDate()).toBe(22)
        expect(result.getHours()).toBe(23)
        expect(result.getMinutes()).toBe(59)
    })

    test('does not mutate original date', () => {
        const original = new Date(2026, 2, 18, 14, 30, 45, 123)
        const originalTime = original.getTime()

        endOfWeek(original)

        expect(original.getTime()).toBe(originalTime)
    })

    test('handles crossing month boundary forward', () => {
        // Thursday 2026-03-26
        const result = endOfWeek(new Date(2026, 2, 26))

        expect(result.getMonth()).toBe(2) // still March
        expect(result.getDate()).toBe(29)
        expect(result.getDay()).toBe(DayOfWeek.SUNDAY)
    })

    test('handles crossing year boundary forward', () => {
        // Tuesday 2026-12-29
        const result = endOfWeek(new Date(2026, 11, 29))

        expect(result.getFullYear()).toBe(2027)
        expect(result.getMonth()).toBe(0) // January
        expect(result.getDate()).toBe(3)
        expect(result.getDay()).toBe(DayOfWeek.SUNDAY)
    })
})
