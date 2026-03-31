import { describe, expect, it } from 'bun:test'
import { isObject } from '../../../src/objects/guards'

describe('isObject', () => {
    it('returns true for an empty plain object', () => {
        expect(isObject({})).toBe(true)
    })

    it('returns true for a plain object with properties', () => {
        expect(isObject({ a: 1, b: 'two', c: true })).toBe(true)
    })

    it('returns true for Object.create(null)', () => {
        expect(isObject(Object.create(null))).toBe(true)
    })

    it('returns true for Object.create({})', () => {
        expect(isObject(Object.create({}))).toBe(true)
    })

    it('returns true for a Date instance', () => {
        expect(isObject(new Date())).toBe(true)
    })

    it('returns true for a Map instance', () => {
        expect(isObject(new Map())).toBe(true)
    })

    it('returns true for a Set instance', () => {
        expect(isObject(new Set())).toBe(true)
    })

    it('returns true for a RegExp instance', () => {
        expect(isObject(/test/u)).toBe(true)
    })

    it('returns true for an Error instance', () => {
        expect(isObject(new Error('test'))).toBe(true)
    })

    it('returns true for a custom class instance', () => {
        class Foo {
            public bar = 42
        }

        expect(isObject(new Foo())).toBe(true)
    })

    it('returns true for a boxed Boolean', () => {
        expect(isObject(Object(true))).toBe(true)
    })

    it('returns true for a boxed Number', () => {
        expect(isObject(Object(1))).toBe(true)
    })

    it('returns true for a boxed String', () => {
        expect(isObject(Object('a'))).toBe(true)
    })

    it('returns true for a typed array', () => {
        expect(isObject(new Uint8Array(0))).toBe(true)
    })

    it('returns true for a WeakMap instance', () => {
        expect(isObject(new WeakMap())).toBe(true)
    })

    it('returns true for a WeakSet instance', () => {
        expect(isObject(new WeakSet())).toBe(true)
    })

    it('returns true for a Promise instance', () => {
        expect(isObject(Promise.resolve())).toBe(true)
    })

    it('returns false for null', () => {
        expect(isObject(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isObject(undefined)).toBe(false)
    })

    it('returns false for a string primitive', () => {
        expect(isObject('hello')).toBe(false)
    })

    it('returns false for an empty string', () => {
        expect(isObject('')).toBe(false)
    })

    it('returns false for a template literal', () => {
        const value = `template`
        expect(isObject(value)).toBe(false)
    })

    it('returns false for a number primitive', () => {
        expect(isObject(42)).toBe(false)
    })

    it('returns false for zero', () => {
        expect(isObject(0)).toBe(false)
    })

    it('returns false for negative zero', () => {
        expect(isObject(-0)).toBe(false)
    })

    it('returns false for NaN', () => {
        expect(isObject(Number.NaN)).toBe(false)
    })

    it('returns false for Infinity', () => {
        expect(isObject(Infinity)).toBe(false)
    })

    it('returns false for -Infinity', () => {
        expect(isObject(-Infinity)).toBe(false)
    })

    it('returns false for a boolean primitive', () => {
        expect(isObject(true)).toBe(false)
        expect(isObject(false)).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isObject(Symbol('test'))).toBe(false)
    })

    it('returns false for a bigint', () => {
        expect(isObject(9_007_199_254_740_991n)).toBe(false)
    })

    it('returns false for an empty array', () => {
        expect(isObject([])).toBe(false)
    })

    it('returns false for an array with elements', () => {
        expect(isObject([1, 2, 3])).toBe(false)
    })

    it('returns false for a function declaration', () => {
        expect(isObject(Function.prototype)).toBe(false)
    })

    it('returns false for an arrow function', () => {
        expect(isObject(() => {})).toBe(false)
    })
})
