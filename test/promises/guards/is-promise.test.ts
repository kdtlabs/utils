import { describe, expect, it } from 'bun:test'
import { isPromise } from '../../../src/promises/guards'

describe('isPromise', () => {
    it('returns true for a resolved native Promise', () => {
        expect(isPromise(Promise.resolve(1))).toBe(true)
    })

    it('returns true for a rejected native Promise', () => {
        const p = Promise.reject(new Error('fail'))
        p.catch(() => {})

        expect(isPromise(p)).toBe(true)
    })

    it('returns true for a pending native Promise', () => {
        const p = new Promise(() => {})

        expect(isPromise(p)).toBe(true)
    })

    it('returns true for a Promise subclass instance', () => {
        class CustomPromise<T> extends Promise<T> {}

        const p = CustomPromise.resolve('value')

        expect(isPromise(p)).toBe(true)
    })

    it('returns true for a fake object with then, catch, and finally as functions', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const fake = { catch: () => {}, finally: () => {}, then: () => {} }

        expect(isPromise(fake)).toBe(true)
    })

    it('returns true for a class instance with then, catch, and finally methods', () => {
        class FullPromiseLike {
            // eslint-disable-next-line unicorn/no-thenable
            public then() {}

            public catch() {}

            public finally() {}
        }

        expect(isPromise(new FullPromiseLike())).toBe(true)
    })

    it('returns true for an object with methods inherited from prototype', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const proto = { catch: () => {}, finally: () => {}, then: () => {} }
        const obj = Object.create(proto)

        expect(isPromise(obj)).toBe(true)
    })

    it('returns false for a thenable missing catch and finally', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const thenable = { then: () => {} }

        expect(isPromise(thenable)).toBe(false)
    })

    it('returns false for an object with then and catch but no finally', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const partial = { catch: () => {}, then: () => {} }

        expect(isPromise(partial)).toBe(false)
    })

    it('returns false for an object with then and finally but no catch', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const partial = { finally: () => {}, then: () => {} }

        expect(isPromise(partial)).toBe(false)
    })

    it('returns false when catch is not a function', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const obj = { catch: 'not a fn', finally: () => {}, then: () => {} }

        expect(isPromise(obj)).toBe(false)
    })

    it('returns false when finally is not a function', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const obj = { catch: () => {}, finally: true, then: () => {} }

        expect(isPromise(obj)).toBe(false)
    })

    it('returns false when then is not a function', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const obj = { catch: () => {}, finally: () => {}, then: null }

        expect(isPromise(obj)).toBe(false)
    })

    it('returns false for null', () => {
        expect(isPromise(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isPromise(undefined)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isPromise({})).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isPromise(42)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isPromise('promise')).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isPromise(true)).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isPromise(Symbol('promise'))).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isPromise([])).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isPromise(() => {})).toBe(false)
    })

    it('returns false for a function with then, catch, and finally properties', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const fn = Object.assign(() => {}, { catch: () => {}, finally: () => {}, then: () => {} })

        expect(isPromise(fn)).toBe(false)
    })

    it('returns false for an array with then, catch, and finally properties', () => {
        // eslint-disable-next-line unicorn/no-thenable
        const arr = Object.assign([], { catch: () => {}, finally: () => {}, then: () => {} })

        expect(isPromise(arr)).toBe(false)
    })
})
