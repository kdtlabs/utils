import { describe, expect, it } from 'bun:test'
import { isTrueLike } from '../../../src/core/guards'

describe('isTrueLike', () => {
    it('returns true for true', () => {
        expect(isTrueLike(true)).toBe(true)
    })

    it('returns false for false', () => {
        expect(isTrueLike(false)).toBe(false)
    })

    it('returns true for "true"', () => {
        expect(isTrueLike('true')).toBe(true)
    })

    it('returns true for "TRUE" (case insensitive)', () => {
        expect(isTrueLike('TRUE')).toBe(true)
    })

    it('returns true for "yes"', () => {
        expect(isTrueLike('yes')).toBe(true)
    })

    it('returns true for "1"', () => {
        expect(isTrueLike('1')).toBe(true)
    })

    it('returns true for "on"', () => {
        expect(isTrueLike('on')).toBe(true)
    })

    it('returns false for "false"', () => {
        expect(isTrueLike('false')).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(isTrueLike('')).toBe(false)
    })

    it('returns false for arbitrary string', () => {
        expect(isTrueLike('hello')).toBe(false)
    })

    it('returns true for number 1', () => {
        expect(isTrueLike(1)).toBe(true)
    })

    it('returns false for number 0', () => {
        expect(isTrueLike(0)).toBe(false)
    })

    it('returns false for number 42 by default', () => {
        expect(isTrueLike(42)).toBe(false)
    })

    it('returns true for bigint 1n', () => {
        expect(isTrueLike(1n)).toBe(true)
    })

    it('returns false for bigint 0n', () => {
        expect(isTrueLike(0n)).toBe(false)
    })

    it('returns false for bigint 42n by default', () => {
        expect(isTrueLike(42n)).toBe(false)
    })

    it('returns false for null', () => {
        expect(isTrueLike(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isTrueLike(undefined)).toBe(false)
    })

    it('returns false for an object', () => {
        expect(isTrueLike({})).toBe(false)
    })

    it('returns true for number 42 with anyNonZeroNumber', () => {
        expect(isTrueLike(42, { anyNonZeroNumber: true })).toBe(true)
    })

    it('returns true for number -1 with anyNonZeroNumber', () => {
        expect(isTrueLike(-1, { anyNonZeroNumber: true })).toBe(true)
    })

    it('returns false for NaN with anyNonZeroNumber', () => {
        expect(isTrueLike(Number.NaN, { anyNonZeroNumber: true })).toBe(false)
    })

    it('returns false for Infinity with anyNonZeroNumber', () => {
        expect(isTrueLike(Infinity, { anyNonZeroNumber: true })).toBe(false)
    })

    it('returns false for number 0 with anyNonZeroNumber', () => {
        expect(isTrueLike(0, { anyNonZeroNumber: true })).toBe(false)
    })

    it('returns true for bigint 42n with anyNonZeroNumber', () => {
        expect(isTrueLike(42n, { anyNonZeroNumber: true })).toBe(true)
    })

    it('returns false for bigint 0n with anyNonZeroNumber', () => {
        expect(isTrueLike(0n, { anyNonZeroNumber: true })).toBe(false)
    })

    it('supports custom trueStrings', () => {
        const trueStrings = new Set(['oui', 'si'])
        expect(isTrueLike('oui', { trueStrings })).toBe(true)
        expect(isTrueLike('si', { trueStrings })).toBe(true)
        expect(isTrueLike('true', { trueStrings })).toBe(false)
    })
})
