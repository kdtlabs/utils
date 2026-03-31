import { describe, expect, it } from 'bun:test'
import { omit } from '../../../src/objects/transformations'

describe('omit', () => {
    it('omits a single key', () => {
        expect(omit({ a: 1, b: 2, c: 3 }, 'b')).toEqual({ a: 1, c: 3 })
    })

    it('omits multiple keys', () => {
        expect(omit({ a: 1, b: 2, c: 3 }, 'a', 'c')).toEqual({ b: 2 })
    })

    it('omits all keys', () => {
        expect(omit({ a: 1, b: 2 }, 'a', 'b')).toEqual({})
    })

    it('returns same structure when no keys are provided', () => {
        expect(omit({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 })
    })

    it('returns empty object when omitting from empty object', () => {
        expect(omit({} as Record<string, number>)).toEqual({})
    })

    it('preserves value references for nested objects', () => {
        const nested = { deep: true }
        const obj = { a: nested, b: 2 }
        const result = omit(obj, 'b')

        expect(result).toEqual({ a: nested })
        expect(result.a).toBe(nested)
    })

    it('omits subset from object with many keys', () => {
        const obj = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`k${i}`, i]))
        const result = omit(obj, 'k0', 'k25', 'k49')

        expect(Object.keys(result).length).toBe(47)
        expect(result.k0).toBeUndefined()
        expect(result.k25).toBeUndefined()
        expect(result.k49).toBeUndefined()
        expect(result.k1).toBe(1)
    })

    it('omits key with undefined value', () => {
        const obj = { a: undefined, b: 2 }
        const result = omit(obj, 'a')

        expect(result).toEqual({ b: 2 })
        expect('a' in result).toBe(false)
    })

    it('omits key with null value', () => {
        expect(omit({ a: null, b: 2 }, 'a')).toEqual({ b: 2 })
    })

    it('does not mutate the original object', () => {
        const obj = { a: 1, b: 2, c: 3 }
        omit(obj, 'a')

        expect(obj).toEqual({ a: 1, b: 2, c: 3 })
    })
})
