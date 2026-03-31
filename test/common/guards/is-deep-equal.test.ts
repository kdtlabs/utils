import { describe, expect, it } from 'bun:test'
import { isDeepEqual } from '@/common/guards'

describe('isDeepEqual', () => {
    it('returns true for identical primitives', () => {
        expect(isDeepEqual(1, 1)).toBe(true)
        expect(isDeepEqual('a', 'a')).toBe(true)
        expect(isDeepEqual(true, true)).toBe(true)
        expect(isDeepEqual(null, null)).toBe(true)
        expect(isDeepEqual(undefined, undefined)).toBe(true)
    })

    it('returns false for different primitives', () => {
        expect(isDeepEqual(1, 2)).toBe(false)
        expect(isDeepEqual('a', 'b')).toBe(false)
        expect(isDeepEqual(true, false)).toBe(false)
    })

    it('returns false for different types', () => {
        expect(isDeepEqual(1, '1')).toBe(false)
        expect(isDeepEqual(null, undefined)).toBe(false)
        expect(isDeepEqual(0, false)).toBe(false)
        expect(isDeepEqual(0, null)).toBe(false)
        expect(isDeepEqual('', false)).toBe(false)
    })

    it('handles NaN correctly via Object.is', () => {
        expect(isDeepEqual(Number.NaN, Number.NaN)).toBe(true)
    })

    it('treats +0 and -0 as equal', () => {
        expect(isDeepEqual(0, -0)).toBe(true)
    })

    it('returns true for same reference', () => {
        const obj = { a: 1 }

        expect(isDeepEqual(obj, obj)).toBe(true)
    })

    it('returns true for equal shallow objects', () => {
        expect(isDeepEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true)
    })

    it('returns false for objects with different values', () => {
        expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false)
    })

    it('returns false for objects with different keys', () => {
        expect(isDeepEqual({ a: 1 }, { b: 1 })).toBe(false)
    })

    it('returns false for objects with different key count', () => {
        expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    })

    it('returns true for equal nested objects', () => {
        const a = { x: { y: { z: 1 } } }
        const b = { x: { y: { z: 1 } } }

        expect(isDeepEqual(a, b)).toBe(true)
    })

    it('returns false for different nested objects', () => {
        const a = { x: { y: { z: 1 } } }
        const b = { x: { y: { z: 2 } } }

        expect(isDeepEqual(a, b)).toBe(false)
    })

    it('returns true for equal arrays', () => {
        expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    })

    it('returns false for arrays with different length', () => {
        expect(isDeepEqual([1, 2], [1, 2, 3])).toBe(false)
    })

    it('returns false for arrays with different values', () => {
        expect(isDeepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    })

    it('returns true for nested arrays', () => {
        expect(isDeepEqual([[1, [2]], [3]], [[1, [2]], [3]])).toBe(true)
    })

    it('returns true for mixed objects and arrays', () => {
        const a = { items: [{ id: 1 }, { id: 2 }] }
        const b = { items: [{ id: 1 }, { id: 2 }] }

        expect(isDeepEqual(a, b)).toBe(true)
    })

    it('returns true for empty objects', () => {
        expect(isDeepEqual({}, {})).toBe(true)
    })

    it('returns true for empty arrays', () => {
        expect(isDeepEqual([], [])).toBe(true)
    })

    it('compares non-plain objects by reference', () => {
        const d1 = new Date('2024-01-01')
        const d2 = new Date('2024-01-01')

        expect(isDeepEqual(d1, d1)).toBe(true)
        expect(isDeepEqual(d1, d2)).toBe(false)
    })

    it('compares Map and Set by reference', () => {
        const m1 = new Map([['a', 1]])
        const m2 = new Map([['a', 1]])
        const s1 = new Set([1])
        const s2 = new Set([1])

        expect(isDeepEqual(m1, m1)).toBe(true)
        expect(isDeepEqual(m1, m2)).toBe(false)
        expect(isDeepEqual(s1, s1)).toBe(true)
        expect(isDeepEqual(s1, s2)).toBe(false)
    })

    it('compares class instances by reference', () => {
        class Foo {
            public constructor(public x: number) {}
        }

        const a = new Foo(1)
        const b = new Foo(1)

        expect(isDeepEqual(a, a)).toBe(true)
        expect(isDeepEqual(a, b)).toBe(false)
    })

    it('does not treat array and object as equal', () => {
        expect(isDeepEqual([], {})).toBe(false)
        expect(isDeepEqual([1], { 0: 1 })).toBe(false)
    })
})
