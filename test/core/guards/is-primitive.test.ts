import { describe, expect, it } from 'bun:test'
import { isPrimitive } from '@/core/guards'

describe('isPrimitive', () => {
    it('returns true for null', () => {
        expect(isPrimitive(null)).toBe(true)
    })

    it('returns true for undefined', () => {
        expect(isPrimitive(undefined)).toBe(true)
    })

    it('returns true for a string', () => {
        expect(isPrimitive('hello')).toBe(true)
    })

    it('returns true for a number', () => {
        expect(isPrimitive(42)).toBe(true)
    })

    it('returns true for a boolean', () => {
        expect(isPrimitive(true)).toBe(true)
    })

    it('returns true for a symbol', () => {
        expect(isPrimitive(Symbol('x'))).toBe(true)
    })

    it('returns true for a bigint', () => {
        expect(isPrimitive(0n)).toBe(true)
    })

    it('returns false for a plain object', () => {
        expect(isPrimitive({})).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isPrimitive([])).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isPrimitive(() => {})).toBe(false)
    })

    it('returns false for a Date', () => {
        expect(isPrimitive(new Date())).toBe(false)
    })
})
