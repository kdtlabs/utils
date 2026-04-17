import { describe, expect, test } from 'bun:test'
import { uuidV7ToDate } from '../../../src/times/conversions'

describe('uuidV7ToDate', () => {
    test('extracts epoch from zero-timestamp UUIDv7', () => {
        expect(uuidV7ToDate('00000000-0000-7000-8000-000000000000').getTime()).toBe(0)
    })

    test('extracts a known timestamp', () => {
        // 0x017f22e279b0 = 1_645_557_742_000 ms → 2022-02-22T19:22:22.000Z
        expect(uuidV7ToDate('017f22e2-79b0-7cc3-98c4-dc0c0c07398f').toISOString())
            .toBe('2022-02-22T19:22:22.000Z')
    })

    test('extracts max 48-bit timestamp', () => {
        // 0xffffffffffff = 281_474_976_710_655 ms
        expect(uuidV7ToDate('ffffffff-ffff-7fff-bfff-ffffffffffff').getTime())
            .toBe(0xFF_FF_FF_FF_FF_FF)
    })

    test('accepts uppercase hex digits', () => {
        expect(uuidV7ToDate('017F22E2-79B0-7CC3-98C4-DC0C0C07398F').toISOString())
            .toBe('2022-02-22T19:22:22.000Z')
    })

    test('accepts mixed-case hex digits', () => {
        expect(uuidV7ToDate('017f22E2-79B0-7cc3-98c4-dc0c0c07398f').toISOString())
            .toBe('2022-02-22T19:22:22.000Z')
    })

    test('throws on wrong length', () => {
        expect(() => uuidV7ToDate('017f22e2-79b0-7cc3-98c4-dc0c0c07398')).toThrow(TypeError)
        expect(() => uuidV7ToDate('')).toThrow(TypeError)
    })

    test('throws when version digit is not 7', () => {
        expect(() => uuidV7ToDate('017f22e2-79b0-4cc3-98c4-dc0c0c07398f')).toThrow(TypeError)
    })

    test('throws when hyphen at position 8 is missing', () => {
        expect(() => uuidV7ToDate('017f22e2x79b0-7cc3-98c4-dc0c0c07398f')).toThrow(TypeError)
    })

    test('throws on non-hex characters in the timestamp region', () => {
        expect(() => uuidV7ToDate('017f22g2-79b0-7cc3-98c4-dc0c0c07398f')).toThrow(TypeError)
        expect(() => uuidV7ToDate('017f22e2-79z0-7cc3-98c4-dc0c0c07398f')).toThrow(TypeError)
    })
})
