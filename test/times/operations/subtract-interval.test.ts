import { describe, expect, test } from 'bun:test'
import { subtractInterval } from '../../../src/times/operations'
import { DayOfWeek } from '../../../src/times/types'

describe('subtractInterval', () => {
    const now = new Date(2026, 2, 18, 14, 30, 45, 123) // Wednesday March 18

    describe('start', () => {
        test('hourly subtracts hours and snaps to start', () => {
            const result = subtractInterval('hourly', 3, 'start', { now })

            expect(result.getHours()).toBe(11)
            expect(result.getMinutes()).toBe(0)
            expect(result.getSeconds()).toBe(0)
            expect(result.getMilliseconds()).toBe(0)
        })

        test('daily subtracts days and snaps to start', () => {
            const result = subtractInterval('daily', 5, 'start', { now })

            expect(result.getDate()).toBe(13)
            expect(result.getHours()).toBe(0)
        })

        test('weekly subtracts weeks and snaps to start (default Monday)', () => {
            const result = subtractInterval('weekly', 3, 'start', { now })

            expect(result.getDay()).toBe(DayOfWeek.MONDAY)
            expect(result.getDate()).toBe(23)
            expect(result.getMonth()).toBe(1) // February
            expect(result.getHours()).toBe(0)
        })

        test('weekly respects weekStartsOn option', () => {
            const result = subtractInterval('weekly', 1, 'start', { now, weekStartsOn: DayOfWeek.SUNDAY })

            expect(result.getDay()).toBe(DayOfWeek.SUNDAY)
            expect(result.getDate()).toBe(8)
        })

        test('monthly subtracts months and snaps to start', () => {
            const result = subtractInterval('monthly', 2, 'start', { now })

            expect(result.getMonth()).toBe(0) // January
            expect(result.getDate()).toBe(1)
            expect(result.getHours()).toBe(0)
        })

        test('yearly subtracts years and snaps to start', () => {
            const result = subtractInterval('yearly', 1, 'start', { now })

            expect(result.getFullYear()).toBe(2025)
            expect(result.getMonth()).toBe(0)
            expect(result.getDate()).toBe(1)
            expect(result.getHours()).toBe(0)
        })
    })

    describe('end', () => {
        test('daily subtracts days and snaps to end', () => {
            const result = subtractInterval('daily', 2, 'end', { now })

            expect(result.getDate()).toBe(16)
            expect(result.getHours()).toBe(23)
            expect(result.getMinutes()).toBe(59)
            expect(result.getSeconds()).toBe(59)
            expect(result.getMilliseconds()).toBe(999)
        })

        test('monthly subtracts months and snaps to end', () => {
            const result = subtractInterval('monthly', 1, 'end', { now })

            expect(result.getMonth()).toBe(1) // February
            expect(result.getDate()).toBe(28)
            expect(result.getHours()).toBe(23)
        })

        test('weekly subtracts weeks and snaps to end', () => {
            const result = subtractInterval('weekly', 2, 'end', { now })

            expect(result.getDay()).toBe(DayOfWeek.SUNDAY)
            expect(result.getHours()).toBe(23)
        })
    })

    test('defaults type to start', () => {
        const result = subtractInterval('daily', 1, undefined, { now })

        expect(result.getDate()).toBe(17)
        expect(result.getHours()).toBe(0)
    })

    test('amount of 0 returns current interval', () => {
        const result = subtractInterval('daily', 0, 'start', { now })

        expect(result.getDate()).toBe(18)
        expect(result.getHours()).toBe(0)
    })
})
