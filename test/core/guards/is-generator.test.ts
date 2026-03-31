import { describe, expect, it } from 'bun:test'
import { isGenerator } from '../../../src/core/guards'

function * gen() {
    yield 1
}

const iteratorOnly = () => ({
    [Symbol.iterator]() {
        return this
    },
})

describe('isGenerator', () => {
    it('returns true for a generator object', () => {
        expect(isGenerator(gen())).toBe(true)
    })

    it('returns true for a manually created iterator', () => {
        const iterator = {
            next() {
                return { done: true, value: undefined }
            },
            [Symbol.iterator]() {
                return this
            },
        }

        expect(isGenerator(iterator)).toBe(true)
    })

    it('returns false for a plain object', () => {
        expect(isGenerator({})).toBe(false)
    })

    it('returns false for an object with only next', () => {
        expect(isGenerator({ next() {} })).toBe(false)
    })

    it('returns false for an object with only Symbol.iterator', () => {
        expect(isGenerator(iteratorOnly())).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isGenerator([1, 2, 3])).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isGenerator('hello')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isGenerator(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isGenerator(undefined)).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isGenerator(42)).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isGenerator(() => {})).toBe(false)
    })
})
