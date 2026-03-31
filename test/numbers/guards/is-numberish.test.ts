import { describe, expect, it } from 'bun:test'
import { isNumberish } from '@/numbers/guards'

describe('isNumberish', () => {
    it('returns true for a number', () => {
        expect(isNumberish(42)).toBe(true)
    })

    it('returns true for NaN', () => {
        expect(isNumberish(Number.NaN)).toBe(true)
    })

    it('returns true for Infinity', () => {
        expect(isNumberish(Infinity)).toBe(true)
    })

    it('returns true for a bigint', () => {
        expect(isNumberish(42n)).toBe(true)
    })

    it('returns true for a numeric string', () => {
        expect(isNumberish('42')).toBe(true)
    })

    it('returns true for Infinity string', () => {
        expect(isNumberish('Infinity')).toBe(true)
    })

    it('returns false for a non-numeric string', () => {
        expect(isNumberish('hello')).toBe(false)
    })

    it('returns false for an empty string', () => {
        expect(isNumberish('')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isNumberish(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isNumberish(undefined)).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isNumberish(true)).toBe(false)
    })

    it('returns false for an object', () => {
        expect(isNumberish({})).toBe(false)
    })
})
