import { describe, expect, it } from 'bun:test'
import { isPromiseLike } from '../../../src/promises/guards'

describe('isPromiseLike', () => {
    it('returns true for a native Promise', () => {
        expect(isPromiseLike(Promise.resolve(1))).toBe(true)
    })

    it('returns true for a rejected native Promise', () => {
        const p = Promise.reject(new Error('fail'))
        p.catch(() => {})

        expect(isPromiseLike(p)).toBe(true)
    })

    it('returns true for a pending native Promise', () => {
        const p = new Promise(() => {})

        expect(isPromiseLike(p)).toBe(true)
    })

    it('returns true for a plain thenable object', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const thenable = { then: (_resolve: (v: number) => void) => {} }

        expect(isPromiseLike(thenable)).toBe(true)
    })

    it('returns true for an object with then as an arrow function', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const thenable = { then: () => {} }

        expect(isPromiseLike(thenable)).toBe(true)
    })

    it('returns true for an object with then and extra properties', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const thenable = { catch: () => {}, extra: 42, then: () => {} }

        expect(isPromiseLike(thenable)).toBe(true)
    })

    it('returns true for a class instance with a then method', () => {
        class Thenable {
            // eslint-disable-next-line unicorn/no-thenable
            public then() {}
        }

        expect(isPromiseLike(new Thenable())).toBe(true)
    })

    it('returns true for a Promise subclass instance', () => {
        class CustomPromise<T> extends Promise<T> {}

        const p = CustomPromise.resolve(42)

        expect(isPromiseLike(p)).toBe(true)
    })

    it('returns true for an object with then inherited from prototype', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const proto = { then: () => {} }
        const obj = Object.create(proto)

        expect(isPromiseLike(obj)).toBe(true)
    })

    it('returns false for null', () => {
        expect(isPromiseLike(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isPromiseLike(undefined)).toBe(false)
    })

    it('returns false for a plain object without then', () => {
        expect(isPromiseLike({})).toBe(false)
    })

    it('returns false for an object with then set to a string', () => {
        // eslint-disable-next-line unicorn/no-thenable
        expect(isPromiseLike({ then: 'not a function' })).toBe(false)
    })

    it('returns false for an object with then set to a number', () => {
        // eslint-disable-next-line unicorn/no-thenable
        expect(isPromiseLike({ then: 42 })).toBe(false)
    })

    it('returns false for an object with then set to true', () => {
        // eslint-disable-next-line unicorn/no-thenable
        expect(isPromiseLike({ then: true })).toBe(false)
    })

    it('returns false for an object with then set to null', () => {
        // eslint-disable-next-line unicorn/no-thenable
        expect(isPromiseLike({ then: null })).toBe(false)
    })

    it('returns false for an object with then set to undefined', () => {
        // eslint-disable-next-line unicorn/no-thenable
        expect(isPromiseLike({ then: undefined })).toBe(false)
    })

    it('returns false for an object with then set to an object', () => {
        // eslint-disable-next-line unicorn/no-thenable
        expect(isPromiseLike({ then: {} })).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isPromiseLike(0)).toBe(false)
        expect(isPromiseLike(42)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isPromiseLike('')).toBe(false)
        expect(isPromiseLike('then')).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isPromiseLike(true)).toBe(false)
        expect(isPromiseLike(false)).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isPromiseLike(Symbol('then'))).toBe(false)
    })

    it('returns false for a bigint', () => {
        expect(isPromiseLike(0n)).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isPromiseLike([])).toBe(false)
    })

    it('returns false for an array with a then property', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const arr = Object.assign([1, 2], { then: () => {} })

        expect(isPromiseLike(arr)).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isPromiseLike(() => {})).toBe(false)
    })

    it('returns false for a function with a then property', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const fn = Object.assign(() => {}, { then: () => {} })

        expect(isPromiseLike(fn)).toBe(false)
    })
})
