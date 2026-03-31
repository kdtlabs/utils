import { describe, expect, test } from 'bun:test'
import { humanizeWithMultiplier } from '@/times/conversions'

describe('humanizeWithMultiplier', () => {
    test('converts numeric input with multiplier', () => {
        expect(humanizeWithMultiplier(1, 1_000_000n)).toBe('1ms')
        expect(humanizeWithMultiplier(1000, 1_000_000n)).toBe('1s')
    })

    test('converts bigint input with multiplier', () => {
        expect(humanizeWithMultiplier(1n, 1_000_000_000n)).toBe('1s')
    })

    test('converts string numeric input', () => {
        expect(humanizeWithMultiplier('1000', 1_000_000n)).toBe('1s')
        expect(humanizeWithMultiplier('60', 1_000_000_000n)).toBe('1m')
    })

    test('returns "0ns" for zero', () => {
        expect(humanizeWithMultiplier(0, 1_000_000n)).toBe('0ns')
        expect(humanizeWithMultiplier('0', 1_000_000n)).toBe('0ns')
    })

    test('handles negative values', () => {
        expect(humanizeWithMultiplier(-1000, 1_000_000n)).toBe('-1s')
    })

    test('returns special number strings as-is', () => {
        expect(humanizeWithMultiplier('NaN', 1_000_000n)).toBe('NaN')
        expect(humanizeWithMultiplier('Infinity', 1_000_000n)).toBe('Infinity')
        expect(humanizeWithMultiplier('+Infinity', 1_000_000n)).toBe('+Infinity')
        expect(humanizeWithMultiplier('-Infinity', 1_000_000n)).toBe('-Infinity')
    })

    test('returns non-numeric strings as-is', () => {
        expect(humanizeWithMultiplier('hello', 1_000_000n)).toBe('hello')
    })

    test('handles numbers that fail BigInt conversion', () => {
        expect(humanizeWithMultiplier(Number.NaN, 1_000_000n)).toBe('NaN')
        expect(humanizeWithMultiplier(Infinity, 1_000_000n)).toBe('Infinity')
        expect(humanizeWithMultiplier(0.5, 1_000_000n)).toBe('0.5')
    })
})
