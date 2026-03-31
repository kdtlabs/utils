import { describe, expect, it } from 'bun:test'
import { isNumberString } from '../../../src/numbers/guards'

describe('isNumberString', () => {
    it('returns true for an integer string', () => {
        expect(isNumberString('42')).toBe(true)
    })

    it('returns true for a negative integer string', () => {
        expect(isNumberString('-42')).toBe(true)
    })

    it('returns true for a float string', () => {
        expect(isNumberString('3.14')).toBe(true)
    })

    it('returns true for a negative float string', () => {
        expect(isNumberString('-0.5')).toBe(true)
    })

    it('returns true for a string with leading dot', () => {
        expect(isNumberString('.5')).toBe(true)
    })

    it('returns true for a string with trailing dot', () => {
        expect(isNumberString('5.')).toBe(true)
    })

    it('returns true for zero', () => {
        expect(isNumberString('0')).toBe(true)
    })

    it('returns true for exponential notation', () => {
        expect(isNumberString('1e10')).toBe(true)
    })

    it('returns true for negative exponential notation', () => {
        expect(isNumberString('1.5e-3')).toBe(true)
    })

    it('returns true for positive sign exponential', () => {
        expect(isNumberString('2.5E+10')).toBe(true)
    })

    it('returns true for positive signed number', () => {
        expect(isNumberString('+42')).toBe(true)
    })

    it('returns true for Infinity', () => {
        expect(isNumberString('Infinity')).toBe(true)
    })

    it('returns true for NaN', () => {
        expect(isNumberString('NaN')).toBe(true)
    })

    it('returns false for an empty string', () => {
        expect(isNumberString('')).toBe(false)
    })

    it('returns false for a whitespace string', () => {
        expect(isNumberString('  ')).toBe(false)
    })

    it('returns false for a non-numeric string', () => {
        expect(isNumberString('hello')).toBe(false)
    })

    it('returns false for a string with letters and numbers', () => {
        expect(isNumberString('12abc')).toBe(false)
    })

    it('returns false for a string with spaces around number', () => {
        expect(isNumberString(' 42 ')).toBe(false)
    })

    it('returns false for a dot only', () => {
        expect(isNumberString('.')).toBe(false)
    })

    it('returns false for multiple dots', () => {
        expect(isNumberString('1.2.3')).toBe(false)
    })

    it('returns false for incomplete exponential', () => {
        expect(isNumberString('1e')).toBe(false)
    })
})
