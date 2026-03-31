import { describe, expect, test } from 'bun:test'
import { fromUnixTimestamp } from '@/times/conversions'

describe('fromUnixTimestamp', () => {
    test('converts 0 to epoch', () => {
        expect(fromUnixTimestamp(0).getTime()).toBe(0)
    })

    test('converts a known timestamp', () => {
        expect(fromUnixTimestamp(1_767_225_600).toISOString()).toBe('2026-01-01T00:00:00.000Z')
    })

    test('handles negative timestamps', () => {
        expect(fromUnixTimestamp(-1).getTime()).toBe(-1000)
    })

    test('roundtrips with toUnixTimestamp', () => {
        const now = new Date()
        const ts = Math.floor(now.getTime() / 1000)

        expect(fromUnixTimestamp(ts).getTime()).toBe(ts * 1000)
    })
})
