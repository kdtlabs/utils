import { describe, expect, it } from 'bun:test'
import { isPlainObject } from '../../../src/objects/guards'

describe('isPlainObject', () => {
    it('returns true for empty object literal', () => {
        expect(isPlainObject({})).toBe(true)
    })

    it('returns true for object literal with properties', () => {
        expect(isPlainObject({ a: 1 })).toBe(true)
    })

    it('returns true for Object.create(null)', () => {
        expect(isPlainObject(Object.create(null))).toBe(true)
    })

    it('returns false for Object.create({})', () => {
        expect(isPlainObject(Object.create({}))).toBe(false)
    })

    it('returns true for nested objects', () => {
        expect(isPlainObject({ a: { b: { c: 1 } } })).toBe(true)
    })

    it('returns true for new Object()', () => {
        expect(isPlainObject(new Object())).toBe(true)
    })

    it('returns false for null', () => {
        expect(isPlainObject(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isPlainObject(undefined)).toBe(false)
    })

    it('returns false for string primitive', () => {
        expect(isPlainObject('hello')).toBe(false)
    })

    it('returns false for number primitive', () => {
        expect(isPlainObject(42)).toBe(false)
    })

    it('returns false for boolean primitive', () => {
        expect(isPlainObject(true)).toBe(false)
    })

    it('returns false for symbol', () => {
        expect(isPlainObject(Symbol('test'))).toBe(false)
    })

    it('returns false for bigint', () => {
        expect(isPlainObject(1n)).toBe(false)
    })

    it('returns false for array', () => {
        expect(isPlainObject([1, 2, 3])).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isPlainObject(Function.prototype)).toBe(false)
    })

    it('returns false for an arrow function', () => {
        expect(isPlainObject(() => {})).toBe(false)
    })

    it('returns false for Date', () => {
        expect(isPlainObject(new Date())).toBe(false)
    })

    it('returns false for Map', () => {
        expect(isPlainObject(new Map())).toBe(false)
    })

    it('returns false for Set', () => {
        expect(isPlainObject(new Set())).toBe(false)
    })

    it('returns false for RegExp', () => {
        expect(isPlainObject(/test/u)).toBe(false)
    })

    it('returns false for Error', () => {
        expect(isPlainObject(new Error('test'))).toBe(false)
    })

    it('returns false for Boolean object', () => {
        expect(isPlainObject(Object(true))).toBe(false)
    })

    it('returns false for Number object', () => {
        expect(isPlainObject(Object(1))).toBe(false)
    })

    it('returns false for String object', () => {
        expect(isPlainObject(Object('a'))).toBe(false)
    })

    it('returns false for class instance with default toString tag', () => {
        class Foo {
            public bar = 1
        }

        expect(isPlainObject(new Foo())).toBe(false)
    })

    it('returns false for class instance with custom toString tag', () => {
        class Bar {
            public readonly [Symbol.toStringTag] = 'Bar'
        }

        expect(isPlainObject(new Bar())).toBe(false)
    })

    it('returns false for NaN', () => {
        expect(isPlainObject(Number.NaN)).toBe(false)
    })

    it('returns false for Infinity', () => {
        expect(isPlainObject(Infinity)).toBe(false)
    })

    it('returns false for Promise', () => {
        expect(isPlainObject(Promise.resolve())).toBe(false)
    })

    it('returns false for WeakMap', () => {
        expect(isPlainObject(new WeakMap())).toBe(false)
    })

    it('returns false for WeakSet', () => {
        expect(isPlainObject(new WeakSet())).toBe(false)
    })
})
