import { describe, expect, it } from 'bun:test'
import { isJsonablePrimitive } from '../../../src/core/guards'

describe('isJsonablePrimitive', () => {
    it('returns true for null', () => {
        expect(isJsonablePrimitive(null)).toBe(true)
    })

    it('returns true for a string', () => {
        expect(isJsonablePrimitive('hello')).toBe(true)
    })

    it('returns true for empty string', () => {
        expect(isJsonablePrimitive('')).toBe(true)
    })

    it('returns true for a number', () => {
        expect(isJsonablePrimitive(42)).toBe(true)
    })

    it('returns true for zero', () => {
        expect(isJsonablePrimitive(0)).toBe(true)
    })

    it('returns true for negative number', () => {
        expect(isJsonablePrimitive(-3.14)).toBe(true)
    })

    it('returns true for a boolean', () => {
        expect(isJsonablePrimitive(true)).toBe(true)
    })

    it('returns false for NaN', () => {
        expect(isJsonablePrimitive(Number.NaN)).toBe(false)
    })

    it('returns false for Infinity', () => {
        expect(isJsonablePrimitive(Infinity)).toBe(false)
    })

    it('returns false for -Infinity', () => {
        expect(isJsonablePrimitive(-Infinity)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isJsonablePrimitive(undefined)).toBe(false)
    })

    it('returns false for an object', () => {
        expect(isJsonablePrimitive({})).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isJsonablePrimitive([])).toBe(false)
    })

    it('returns false for a bigint', () => {
        expect(isJsonablePrimitive(1n)).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isJsonablePrimitive(Symbol('x'))).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isJsonablePrimitive(() => {})).toBe(false)
    })
})
