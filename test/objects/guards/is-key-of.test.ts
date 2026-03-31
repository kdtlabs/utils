import { describe, expect, it } from 'bun:test'
import { isKeyOf } from '../../../src/objects/guards'

describe('isKeyOf', () => {
    it('returns true for an existing string key', () => {
        const obj = { age: 30, name: 'Alice' }
        expect(isKeyOf(obj, 'name')).toBe(true)
    })

    it('returns true for an existing numeric key', () => {
        const obj = { 0: 'zero', 1: 'one', 2: 'two' }
        expect(isKeyOf(obj, 0)).toBe(true)
    })

    it('returns true for a symbol key', () => {
        const sym = Symbol('id')
        const obj = { [sym]: 42 }
        expect(isKeyOf(obj, sym)).toBe(true)
    })

    it('returns true for inherited property "toString"', () => {
        const obj = { a: 1 }
        expect(isKeyOf(obj, 'toString')).toBe(true)
    })

    it('returns true for inherited property "hasOwnProperty"', () => {
        const obj = { a: 1 }
        expect(isKeyOf(obj, 'hasOwnProperty')).toBe(true)
    })

    it('returns true for inherited property "constructor"', () => {
        const obj = { a: 1 }
        expect(isKeyOf(obj, 'constructor')).toBe(true)
    })

    it('returns true for a property with undefined value', () => {
        const obj = { a: undefined }
        expect(isKeyOf(obj, 'a')).toBe(true)
    })

    it('returns true only for top-level key of a nested object', () => {
        const obj = { outer: { inner: 1 } }
        expect(isKeyOf(obj, 'outer')).toBe(true)
        expect(isKeyOf(obj, 'inner')).toBe(false)
    })

    it('returns true for a property inherited via Object.create', () => {
        const proto = { inherited: true }
        const obj = Object.create(proto) as { inherited: boolean }
        expect(isKeyOf(obj, 'inherited')).toBe(true)
    })

    it('returns false for a non-existent string key', () => {
        const obj = { a: 1, b: 2 }
        expect(isKeyOf(obj, 'c')).toBe(false)
    })

    it('returns false for a non-existent symbol key', () => {
        const sym = Symbol('missing')
        const obj = { a: 1 }
        expect(isKeyOf(obj, sym)).toBe(false)
    })

    it('returns false for any key in an empty object', () => {
        const obj = {}
        expect(isKeyOf(obj, 'anything')).toBe(false)
    })

    it('returns false for a key that has been deleted', () => {
        const obj: Record<string, number> = { a: 1, b: 2 }
        delete obj.a
        expect(isKeyOf(obj, 'a')).toBe(false)
    })

    it('returns false for a numeric key not present', () => {
        const obj = { 0: 'zero' }
        expect(isKeyOf(obj, 5)).toBe(false)
    })

    it('returns false for "toString" on Object.create(null)', () => {
        const obj = Object.create(null) as Record<string, never>
        expect(isKeyOf(obj, 'toString')).toBe(false)
    })
})
