import { describe, expect, it } from 'bun:test'
import { toString } from '../../../src/core/conversions'

describe('toString', () => {
    it('returns [object Null] for null', () => {
        expect(toString(null)).toBe('[object Null]')
    })

    it('returns [object Undefined] for undefined', () => {
        expect(toString(undefined)).toBe('[object Undefined]')
    })

    it('returns [object String] for a string', () => {
        expect(toString('hello')).toBe('[object String]')
    })

    it('returns [object Number] for a number', () => {
        expect(toString(42)).toBe('[object Number]')
    })

    it('returns [object Object] for a plain object', () => {
        expect(toString({})).toBe('[object Object]')
    })

    it('returns [object Array] for an array', () => {
        expect(toString([])).toBe('[object Array]')
    })

    it('returns [object Function] for a function', () => {
        expect(toString(() => {})).toBe('[object Function]')
    })

    it('returns [object Date] for a date', () => {
        expect(toString(new Date())).toBe('[object Date]')
    })

    it('returns [object RegExp] for a regex', () => {
        expect(toString(/test/u)).toBe('[object RegExp]')
    })
})
