import { describe, expect, it } from 'bun:test'
import { pick } from '../../../src/objects/transformations'

describe('pick', () => {
    it('picks a single key', () => {
        expect(pick({ a: 1, b: 2, c: 3 }, 'a')).toEqual({ a: 1 })
    })

    it('picks multiple keys', () => {
        expect(pick({ a: 1, b: 2, c: 3 }, 'a', 'c')).toEqual({ a: 1, c: 3 })
    })

    it('picks all keys', () => {
        expect(pick({ a: 1, b: 2 }, 'a', 'b')).toEqual({ a: 1, b: 2 })
    })

    it('returns empty object when no keys are provided', () => {
        const obj: Record<string, number> = { a: 1, b: 2 }
        expect(pick(obj)).toEqual({})
    })

    it('returns empty object when picking from empty object', () => {
        expect(pick({} as Record<string, number>)).toEqual({})
    })

    it('preserves value references for nested objects', () => {
        const nested = { deep: true }
        const obj = { a: nested, b: 2 }
        const result = pick(obj, 'a')

        expect(result).toEqual({ a: nested })
        expect(result.a).toBe(nested)
    })

    it('picks subset from object with many keys', () => {
        const obj = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`k${i}`, i]))
        const result = pick(obj, 'k0', 'k25', 'k49')

        expect(result).toEqual({ k0: 0, k25: 25, k49: 49 })
        expect(Object.keys(result).length).toBe(3)
    })

    it('picks key with undefined value', () => {
        const obj = { a: undefined, b: 2 }
        const result = pick(obj, 'a')

        expect(result).toEqual({ a: undefined })
        expect('a' in result).toBe(true)
    })

    it('picks key with null value', () => {
        expect(pick({ a: null, b: 2 }, 'a')).toEqual({ a: null })
    })

    it('does not mutate the original object', () => {
        const obj = { a: 1, b: 2, c: 3 }
        pick(obj, 'a')

        expect(obj).toEqual({ a: 1, b: 2, c: 3 })
    })
})
