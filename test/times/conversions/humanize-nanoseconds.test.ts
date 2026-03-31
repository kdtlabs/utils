import { describe, expect, test } from 'bun:test'
import { humanizeNanoseconds } from '../../../src/times/conversions'

describe('humanizeNanoseconds', () => {
    test('returns "0ns" for zero', () => {
        expect(humanizeNanoseconds(0n)).toBe('0ns')
        expect(humanizeNanoseconds(0)).toBe('0ns')
        expect(humanizeNanoseconds('0')).toBe('0ns')
    })

    test('formats single nanosecond', () => {
        expect(humanizeNanoseconds(1n)).toBe('1ns')
    })

    test('formats microseconds', () => {
        expect(humanizeNanoseconds(1000n)).toBe('1\u03BCs')
    })

    test('formats milliseconds', () => {
        expect(humanizeNanoseconds(1_000_000n)).toBe('1ms')
    })

    test('formats seconds', () => {
        expect(humanizeNanoseconds(1_000_000_000n)).toBe('1s')
    })

    test('formats minutes', () => {
        expect(humanizeNanoseconds(60_000_000_000n)).toBe('1m')
    })

    test('formats hours', () => {
        expect(humanizeNanoseconds(3_600_000_000_000n)).toBe('1h')
    })

    test('formats multi-unit durations', () => {
        expect(humanizeNanoseconds(3_661_001_001_001n)).toBe('1h 1m 1s 1ms 1\u03BCs 1ns')
    })

    test('handles negative values', () => {
        expect(humanizeNanoseconds(-1_000_000_000n)).toBe('-1s')
        expect(humanizeNanoseconds(-3_661_000_000_000n)).toBe('-1h 1m 1s')
    })

    test('accepts number input', () => {
        expect(humanizeNanoseconds(1_000_000_000)).toBe('1s')
    })

    test('accepts string input', () => {
        expect(humanizeNanoseconds('1000000000')).toBe('1s')
    })

    test('returns special number strings as-is', () => {
        expect(humanizeNanoseconds('NaN')).toBe('NaN')
        expect(humanizeNanoseconds('Infinity')).toBe('Infinity')
        expect(humanizeNanoseconds('+Infinity')).toBe('+Infinity')
        expect(humanizeNanoseconds('-Infinity')).toBe('-Infinity')
    })

    test('returns non-numeric strings as-is', () => {
        expect(humanizeNanoseconds('hello')).toBe('hello')
    })

    test('treats empty string as zero', () => {
        expect(humanizeNanoseconds('')).toBe('0ns')
    })

    test('handles numbers that fail BigInt conversion', () => {
        expect(humanizeNanoseconds(Number.NaN)).toBe('NaN')
        expect(humanizeNanoseconds(Infinity)).toBe('Infinity')
        expect(humanizeNanoseconds(-Infinity)).toBe('-Infinity')
        expect(humanizeNanoseconds(0.5)).toBe('0.5')
    })
})
