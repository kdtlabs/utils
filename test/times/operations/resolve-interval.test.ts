import { describe, expect, test } from 'bun:test'
import { resolveInterval } from '../../../src/times/operations'
import { DayOfWeek } from '../../../src/times/types'

describe('resolveInterval', () => {
    const now = new Date(2026, 2, 18, 14, 30, 45, 123) // Wednesday

    describe('start', () => {
        test('hourly returns start of hour', () => {
            const result = resolveInterval('hourly', 'start', { now })

            expect(result.getHours()).toBe(14)
            expect(result.getMinutes()).toBe(0)
            expect(result.getSeconds()).toBe(0)
            expect(result.getMilliseconds()).toBe(0)
        })

        test('daily returns start of day', () => {
            const result = resolveInterval('daily', 'start', { now })

            expect(result.getDate()).toBe(18)
            expect(result.getHours()).toBe(0)
            expect(result.getMinutes()).toBe(0)
        })

        test('weekly returns start of week (default Monday)', () => {
            const result = resolveInterval('weekly', 'start', { now })

            expect(result.getDay()).toBe(DayOfWeek.MONDAY)
            expect(result.getDate()).toBe(16)
            expect(result.getHours()).toBe(0)
        })

        test('weekly respects weekStartsOn option', () => {
            const result = resolveInterval('weekly', 'start', { now, weekStartsOn: DayOfWeek.SUNDAY })

            expect(result.getDay()).toBe(DayOfWeek.SUNDAY)
            expect(result.getDate()).toBe(15)
        })

        test('monthly returns start of month', () => {
            const result = resolveInterval('monthly', 'start', { now })

            expect(result.getDate()).toBe(1)
            expect(result.getHours()).toBe(0)
        })

        test('yearly returns start of year', () => {
            const result = resolveInterval('yearly', 'start', { now })

            expect(result.getMonth()).toBe(0)
            expect(result.getDate()).toBe(1)
            expect(result.getHours()).toBe(0)
        })
    })

    describe('end', () => {
        test('hourly returns end of hour', () => {
            const result = resolveInterval('hourly', 'end', { now })

            expect(result.getHours()).toBe(14)
            expect(result.getMinutes()).toBe(59)
            expect(result.getSeconds()).toBe(59)
            expect(result.getMilliseconds()).toBe(999)
        })

        test('daily returns end of day', () => {
            const result = resolveInterval('daily', 'end', { now })

            expect(result.getDate()).toBe(18)
            expect(result.getHours()).toBe(23)
            expect(result.getMinutes()).toBe(59)
        })

        test('weekly returns end of week (default Monday start → Sunday end)', () => {
            const result = resolveInterval('weekly', 'end', { now })

            expect(result.getDay()).toBe(DayOfWeek.SUNDAY)
            expect(result.getDate()).toBe(22)
            expect(result.getHours()).toBe(23)
        })

        test('weekly respects weekStartsOn option', () => {
            const result = resolveInterval('weekly', 'end', { now, weekStartsOn: DayOfWeek.SUNDAY })

            expect(result.getDay()).toBe(DayOfWeek.SATURDAY)
            expect(result.getDate()).toBe(21)
        })

        test('monthly returns end of month', () => {
            const result = resolveInterval('monthly', 'end', { now })

            expect(result.getDate()).toBe(31)
            expect(result.getHours()).toBe(23)
        })

        test('yearly returns end of year', () => {
            const result = resolveInterval('yearly', 'end', { now })

            expect(result.getMonth()).toBe(11)
            expect(result.getDate()).toBe(31)
            expect(result.getHours()).toBe(23)
        })
    })

    test('defaults now to current time', () => {
        const before = new Date()
        const result = resolveInterval('daily', 'start')
        const after = new Date()

        expect(result.getFullYear()).toBe(before.getFullYear())
        expect(result.getMonth()).toBe(before.getMonth())
        expect(result.getDate()).toBeGreaterThanOrEqual(before.getDate())
        expect(result.getDate()).toBeLessThanOrEqual(after.getDate())
        expect(result.getHours()).toBe(0)
    })

    test('accepts DateLike as now', () => {
        const result = resolveInterval('daily', 'start', { now: '2026-06-15T10:00:00' })

        expect(result.getFullYear()).toBe(2026)
        expect(result.getMonth()).toBe(5)
        expect(result.getDate()).toBe(15)
        expect(result.getHours()).toBe(0)
    })
})
