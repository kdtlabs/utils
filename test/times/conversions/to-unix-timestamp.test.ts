import { describe, expect, test } from 'bun:test'
import { toUnixTimestamp } from '@/times/conversions'

describe('toUnixTimestamp', () => {
    test('converts epoch to 0', () => {
        expect(toUnixTimestamp(new Date(0))).toBe(0)
    })

    test('converts a known date', () => {
        expect(toUnixTimestamp(new Date('2026-01-01T00:00:00.000Z'))).toBe(1_767_225_600)
    })

    test('floors sub-second precision', () => {
        expect(toUnixTimestamp(new Date(1500))).toBe(1)
    })

    test('handles negative timestamps (before epoch)', () => {
        expect(toUnixTimestamp(new Date(-1000))).toBe(-1)
    })
})
