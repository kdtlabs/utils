import { describe, expect, it } from 'bun:test'
import { isIterable } from '@/collections/guards'

function * gen() {
    yield 1
}

describe('isIterable', () => {
    it('returns true for an array', () => {
        expect(isIterable([])).toBe(true)
        expect(isIterable([1, 2, 3])).toBe(true)
    })

    it('returns false for a string (typeof string !== object)', () => {
        expect(isIterable('hello')).toBe(false)
        expect(isIterable('')).toBe(false)
    })

    it('returns true for a Set', () => {
        expect(isIterable(new Set())).toBe(true)
        expect(isIterable(new Set([1, 2]))).toBe(true)
    })

    it('returns true for a Map', () => {
        expect(isIterable(new Map())).toBe(true)
        expect(isIterable(new Map([['a', 1]]))).toBe(true)
    })

    it('returns true for a typed array', () => {
        expect(isIterable(new Uint8Array())).toBe(true)
        expect(isIterable(new Int32Array([1, 2]))).toBe(true)
    })

    it('returns true for a generator', () => {
        expect(isIterable(gen())).toBe(true)
    })

    it('returns true for a custom iterable object', () => {
        const custom = {
            * [Symbol.iterator]() {
                yield 1
                yield 2
            },
        }

        expect(isIterable(custom)).toBe(true)
    })

    it('returns false for null', () => {
        expect(isIterable(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isIterable(undefined)).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isIterable(0)).toBe(false)
        expect(isIterable(42)).toBe(false)
        expect(isIterable(Number.NaN)).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isIterable(true)).toBe(false)
        expect(isIterable(false)).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isIterable(Symbol('test'))).toBe(false)
    })

    it('returns false for a bigint', () => {
        expect(isIterable(1n)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isIterable({})).toBe(false)
        expect(isIterable({ a: 1 })).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isIterable(() => {})).toBe(false)
    })

    it('returns false for an object with a non-function Symbol.iterator', () => {
        const fake = { [Symbol.iterator]: 'not a function' }
        expect(isIterable(fake)).toBe(false)
    })

    it('returns false for an object with Symbol.iterator set to null', () => {
        const fake = { [Symbol.iterator]: null }
        expect(isIterable(fake)).toBe(false)
    })

    describe('edge cases', () => {
        it('returns false for a Date object', () => {
            expect(isIterable(new Date())).toBe(false)
        })

        it('returns false for a RegExp', () => {
            expect(isIterable(/test/u)).toBe(false)
        })

        it('returns false for an Error object', () => {
            expect(isIterable(new Error('test'))).toBe(false)
        })

        it('returns true for a custom object with Symbol.iterator as a generator', () => {
            const obj = {
                * [Symbol.iterator]() {
                    yield 1
                },
            }

            expect(isIterable(obj)).toBe(true)
        })

        it('returns false for an object with Symbol.iterator as a number', () => {
            const fake = { [Symbol.iterator]: 42 }
            expect(isIterable(fake)).toBe(false)
        })

        it('returns false for an object with Symbol.iterator as undefined', () => {
            const fake = { [Symbol.iterator]: undefined }
            expect(isIterable(fake)).toBe(false)
        })

        it('returns true for an empty Set', () => {
            expect(isIterable(new Set())).toBe(true)
        })

        it('returns false for a Promise', () => {
            expect(isIterable(Promise.resolve())).toBe(false)
        })

        it('returns false for Object.create(null)', () => {
            expect(isIterable(Object.create(null))).toBe(false)
        })

        it('returns true for Map.keys() iterator', () => {
            expect(isIterable(new Map([['a', 1]]).keys())).toBe(true)
        })

        it('returns true for Set.values() iterator', () => {
            expect(isIterable(new Set([1, 2]).values())).toBe(true)
        })

        it('returns true for an array iterator', () => {
            expect(isIterable([1, 2][Symbol.iterator]())).toBe(true)
        })

        it('returns false for a WeakRef', () => {
            expect(isIterable(new WeakRef({}))).toBe(false)
        })

        it('returns false for a class instance without Symbol.iterator', () => {
            class Foo {
                public size = 0
            }

            expect(isIterable(new Foo())).toBe(false)
        })
    })
})
