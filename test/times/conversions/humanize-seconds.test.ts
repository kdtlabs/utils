import { describe, expect, test } from 'bun:test'
import { humanizeSeconds } from '@/times/conversions'

describe('humanizeSeconds', () => {
    test('returns "0ns" for zero', () => {
        expect(humanizeSeconds(0)).toBe('0ns')
    })

    test('formats 1 second', () => {
        expect(humanizeSeconds(1)).toBe('1s')
    })

    test('formats minutes', () => {
        expect(humanizeSeconds(60)).toBe('1m')
    })

    test('formats hours', () => {
        expect(humanizeSeconds(3600)).toBe('1h')
    })

    test('formats multi-unit', () => {
        expect(humanizeSeconds(3661)).toBe('1h 1m 1s')
    })

    test('handles negative values', () => {
        expect(humanizeSeconds(-60)).toBe('-1m')
    })

    test('returns special number strings as-is', () => {
        expect(humanizeSeconds('NaN')).toBe('NaN')
        expect(humanizeSeconds('Infinity')).toBe('Infinity')
    })

    test('handles non-numeric strings gracefully', () => {
        expect(humanizeSeconds('hello')).toBe('hello')
    })

    test('handles numbers that fail BigInt conversion', () => {
        expect(humanizeSeconds(Number.NaN)).toBe('NaN')
        expect(humanizeSeconds(0.5)).toBe('0.5')
    })
})
