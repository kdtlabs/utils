import { describe, expect, test } from 'bun:test'
import { addInterval } from '../../../src/times/operations'
import { DayOfWeek } from '../../../src/times/types'

describe('addInterval', () => {
    const now = new Date(2026, 2, 18, 14, 30, 45, 123) // Wednesday March 18

    describe('start', () => {
        test('hourly adds hours and snaps to start', () => {
            const result = addInterval('hourly', 3, 'start', { now })

            expect(result.getHours()).toBe(17)
            expect(result.getMinutes()).toBe(0)
            expect(result.getSeconds()).toBe(0)
        })

        test('daily adds days and snaps to start', () => {
            const result = addInterval('daily', 5, 'start', { now })

            expect(result.getDate()).toBe(23)
            expect(result.getHours()).toBe(0)
        })

        test('weekly adds weeks and snaps to start (default Monday)', () => {
            const result = addInterval('weekly', 2, 'start', { now })

            expect(result.getDay()).toBe(DayOfWeek.MONDAY)
            expect(result.getMonth()).toBe(2) // March
            expect(result.getDate()).toBe(30)
            expect(result.getHours()).toBe(0)
        })

        test('monthly adds months and snaps to start', () => {
            const result = addInterval('monthly', 3, 'start', { now })

            expect(result.getMonth()).toBe(5) // June
            expect(result.getDate()).toBe(1)
            expect(result.getHours()).toBe(0)
        })

        test('yearly adds years and snaps to start', () => {
            const result = addInterval('yearly', 2, 'start', { now })

            expect(result.getFullYear()).toBe(2028)
            expect(result.getMonth()).toBe(0)
            expect(result.getDate()).toBe(1)
        })
    })

    describe('end', () => {
        test('daily adds days and snaps to end', () => {
            const result = addInterval('daily', 3, 'end', { now })

            expect(result.getDate()).toBe(21)
            expect(result.getHours()).toBe(23)
            expect(result.getMinutes()).toBe(59)
            expect(result.getSeconds()).toBe(59)
            expect(result.getMilliseconds()).toBe(999)
        })

        test('monthly adds months and snaps to end', () => {
            const result = addInterval('monthly', 1, 'end', { now })

            expect(result.getMonth()).toBe(3) // April
            expect(result.getDate()).toBe(30)
            expect(result.getHours()).toBe(23)
        })
    })

    test('defaults type to start', () => {
        const result = addInterval('daily', 1, undefined, { now })

        expect(result.getDate()).toBe(19)
        expect(result.getHours()).toBe(0)
    })
})
