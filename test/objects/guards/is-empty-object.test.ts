import { describe, expect, it } from 'bun:test'
import { isEmptyObject } from '../../../src/objects/guards'

describe('isEmptyObject', () => {
    it('returns true for an empty object literal', () => {
        expect(isEmptyObject({})).toBe(true)
    })

    it('returns true for Object.create(null)', () => {
        expect(isEmptyObject(Object.create(null))).toBe(true)
    })

    it('returns true for an object with only inherited properties', () => {
        const obj = Object.create({ inherited: 1 })
        expect(isEmptyObject(obj)).toBe(true)
    })

    it('returns true for an object with only symbol keys', () => {
        expect(isEmptyObject({ [Symbol('key')]: 1 })).toBe(true)
    })

    it('returns true for an object with only non-enumerable properties', () => {
        const obj = {}
        Object.defineProperty(obj, 'hidden', { enumerable: false, value: 1 })
        expect(isEmptyObject(obj)).toBe(true)
    })

    it('returns true for new Object()', () => {
        expect(isEmptyObject(new Object())).toBe(true)
    })

    it('returns false for an object with one property', () => {
        expect(isEmptyObject({ a: 1 })).toBe(false)
    })

    it('returns false for an object with an undefined value', () => {
        expect(isEmptyObject({ a: undefined })).toBe(false)
    })

    it('returns false for an object with multiple keys', () => {
        expect(isEmptyObject({ a: 1, b: 2, c: 3 })).toBe(false)
    })

    it('returns false for a deeply nested object', () => {
        expect(isEmptyObject({ a: { b: 1 } })).toBe(false)
    })

    it('returns false for an object with a numeric string key', () => {
        expect(isEmptyObject({ '0': 'a' })).toBe(false)
    })

    it('returns false for an object with an empty string key', () => {
        expect(isEmptyObject({ '': 1 })).toBe(false)
    })
})
