import { describe, expect, it } from 'bun:test'
import { typeOf } from '@/core/conversions'

describe('typeOf', () => {
    it('returns "null" for null', () => {
        expect(typeOf(null)).toBe('null')
    })

    it('returns "undefined" for undefined', () => {
        expect(typeOf(undefined)).toBe('undefined')
    })

    it('returns "string" for a string', () => {
        expect(typeOf('hello')).toBe('string')
    })

    it('returns "number" for a number', () => {
        expect(typeOf(42)).toBe('number')
    })

    it('returns "boolean" for a boolean', () => {
        expect(typeOf(true)).toBe('boolean')
    })

    it('returns "symbol" for a symbol', () => {
        expect(typeOf(Symbol('x'))).toBe('symbol')
    })

    it('returns "bigint" for a bigint', () => {
        expect(typeOf(1n)).toBe('bigint')
    })

    it('returns "object" for a plain object', () => {
        expect(typeOf({})).toBe('object')
    })

    it('returns "array" for an array', () => {
        expect(typeOf([])).toBe('array')
    })

    it('returns "function" for a function', () => {
        expect(typeOf(() => {})).toBe('function')
    })

    it('returns "date" for a Date', () => {
        expect(typeOf(new Date())).toBe('date')
    })

    it('returns "regexp" for a RegExp', () => {
        expect(typeOf(/test/u)).toBe('regexp')
    })

    it('returns "map" for a Map', () => {
        expect(typeOf(new Map())).toBe('map')
    })

    it('returns "set" for a Set', () => {
        expect(typeOf(new Set())).toBe('set')
    })
})
