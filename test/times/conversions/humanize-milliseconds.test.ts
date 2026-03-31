import { describe, expect, test } from 'bun:test'
import { humanizeMilliseconds } from '../../../src/times/conversions'

describe('humanizeMilliseconds', () => {
    test('returns "0ns" for zero', () => {
        expect(humanizeMilliseconds(0)).toBe('0ns')
    })

    test('formats 1ms', () => {
        expect(humanizeMilliseconds(1)).toBe('1ms')
    })

    test('formats seconds', () => {
        expect(humanizeMilliseconds(1000)).toBe('1s')
    })

    test('formats multi-unit', () => {
        expect(humanizeMilliseconds(3_661_001)).toBe('1h 1m 1s 1ms')
    })

    test('handles negative values', () => {
        expect(humanizeMilliseconds(-1000)).toBe('-1s')
    })

    test('returns special number strings as-is', () => {
        expect(humanizeMilliseconds('NaN')).toBe('NaN')
        expect(humanizeMilliseconds('Infinity')).toBe('Infinity')
        expect(humanizeMilliseconds('+Infinity')).toBe('+Infinity')
        expect(humanizeMilliseconds('-Infinity')).toBe('-Infinity')
    })

    test('handles non-numeric strings gracefully', () => {
        expect(humanizeMilliseconds('hello')).toBe('hello')
    })

    test('handles numbers that fail BigInt conversion', () => {
        expect(humanizeMilliseconds(Number.NaN)).toBe('NaN')
        expect(humanizeMilliseconds(Infinity)).toBe('Infinity')
        expect(humanizeMilliseconds(0.5)).toBe('0.5')
    })
})
