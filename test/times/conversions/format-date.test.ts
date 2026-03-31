import { describe, expect, test } from 'bun:test'
import { formatDate } from '@/times/conversions'

describe('formatDate', () => {
    const date = new Date(2026, 2, 15, 9, 5, 3, 7)

    test('uses default format when no format argument is provided', () => {
        expect(formatDate(date)).toBe('09:05:03.007 15/03/2026')
    })

    test('formats date only', () => {
        expect(formatDate(date, 'yyyy-MM-dd')).toBe('2026-03-15')
    })

    test('formats time only', () => {
        expect(formatDate(date, 'HH:mm:ss')).toBe('09:05:03')
    })

    test('formats time with milliseconds', () => {
        expect(formatDate(date, 'HH:mm:ss.SSS')).toBe('09:05:03.007')
    })

    test('formats full datetime', () => {
        expect(formatDate(date, 'dd/MM/yyyy HH:mm:ss.SSS')).toBe('15/03/2026 09:05:03.007')
    })

    test('handles adjacent tokens with no separators', () => {
        expect(formatDate(date, 'yyyyMMddHHmmssSSS')).toBe('20260315090503007')
    })

    test('handles repeated tokens', () => {
        expect(formatDate(date, 'yyyy yyyy MM MM dd dd')).toBe('2026 2026 03 03 15 15')
    })

    test('returns format string as-is when no tokens are present', () => {
        expect(formatDate(date, 'no-tokens-here')).toBe('no-tokens-here')
    })

    test('returns empty string for empty format', () => {
        expect(formatDate(date, '')).toBe('')
    })

    test('zero-pads values less than 10', () => {
        const d = new Date(2026, 0, 2, 3, 4, 5, 6)

        expect(formatDate(d, 'MM')).toBe('01')
        expect(formatDate(d, 'dd')).toBe('02')
        expect(formatDate(d, 'HH')).toBe('03')
        expect(formatDate(d, 'mm')).toBe('04')
        expect(formatDate(d, 'ss')).toBe('05')
        expect(formatDate(d, 'SSS')).toBe('006')
    })

    test('does not add extra padding when values are already wide enough', () => {
        const d = new Date(2026, 11, 25, 23, 59, 59, 999)

        expect(formatDate(d, 'MM')).toBe('12')
        expect(formatDate(d, 'dd')).toBe('25')
        expect(formatDate(d, 'HH')).toBe('23')
        expect(formatDate(d, 'mm')).toBe('59')
        expect(formatDate(d, 'ss')).toBe('59')
        expect(formatDate(d, 'SSS')).toBe('999')
    })

    test('formats midnight correctly', () => {
        const midnight = new Date(2026, 0, 1, 0, 0, 0, 0)

        expect(formatDate(midnight)).toBe('00:00:00.000 01/01/2026')
    })

    test('formats end of year correctly', () => {
        const endOfYear = new Date(2026, 11, 31, 23, 59, 59, 999)

        expect(formatDate(endOfYear)).toBe('23:59:59.999 31/12/2026')
    })

    test('throws TypeError for invalid Date', () => {
        expect(() => formatDate(new Date('garbage'))).toThrow(TypeError)
        expect(() => formatDate(new Date(Number.NaN))).toThrow(TypeError)
    })
})
