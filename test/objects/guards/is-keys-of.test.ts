import { describe, expect, it } from 'bun:test'
import { isKeysOf } from '../../../src/objects/guards'

describe('isKeysOf', () => {
    it('returns true when all keys are present', () => {
        expect(isKeysOf({ a: 1, b: 2, c: 3 }, 'a', 'b', 'c')).toBe(true)
    })

    it('returns true when a single key is present', () => {
        expect(isKeysOf({ a: 1, b: 2 }, 'a')).toBe(true)
    })

    it('returns true when object has more keys than checked', () => {
        expect(isKeysOf({ a: 1, b: 2, c: 3 }, 'a', 'b')).toBe(true)
    })

    it('returns true when keys have undefined values', () => {
        expect(isKeysOf({ a: undefined, b: undefined }, 'a', 'b')).toBe(true)
    })

    it('returns true when keys have null values', () => {
        expect(isKeysOf({ a: null }, 'a')).toBe(true)
    })

    it('returns true for inherited keys', () => {
        expect(isKeysOf({}, 'toString')).toBe(true)
        expect(isKeysOf({}, 'constructor')).toBe(true)
        expect(isKeysOf({}, 'hasOwnProperty')).toBe(true)
    })

    it('returns true when no keys are provided (vacuous truth)', () => {
        expect(isKeysOf({})).toBe(true)
        expect(isKeysOf({ a: 1 })).toBe(true)
    })

    it('returns true when symbol keys are present', () => {
        const sym = Symbol('test')
        expect(isKeysOf({ [sym]: 'value' }, sym)).toBe(true)
    })

    it('returns true for numeric string keys', () => {
        expect(isKeysOf({ 0: 'a', 1: 'b' }, '0', '1')).toBe(true)
    })

    it('returns true for numeric keys matching numeric string properties', () => {
        expect(isKeysOf({ 0: 'a', 1: 'b' }, 0, 1)).toBe(true)
    })

    it('returns true for mixed string and symbol keys', () => {
        const sym = Symbol('mixed')
        const obj: Record<string | symbol, unknown> = { a: 1, [sym]: 2 }
        expect(isKeysOf<string | symbol>(obj, 'a', sym)).toBe(true)
    })

    it('returns true for keys from prototype chain', () => {
        const parent = { inherited: true }
        const child = Object.create(parent) as Record<string, unknown>
        child.own = true

        expect(isKeysOf(child, 'own', 'inherited')).toBe(true)
    })

    it('returns false when one key is missing', () => {
        expect(isKeysOf({ a: 1, b: 2 }, 'a', 'b', 'c')).toBe(false)
    })

    it('returns false when all keys are missing', () => {
        expect(isKeysOf({ a: 1 }, 'x', 'y', 'z')).toBe(false)
    })

    it('returns false when some keys are present and some are missing', () => {
        expect(isKeysOf({ a: 1, b: 2 }, 'a', 'c')).toBe(false)
    })

    it('returns false when checking non-inherited keys on an empty object', () => {
        expect(isKeysOf({}, 'a')).toBe(false)
    })

    it('returns false for toString on Object.create(null)', () => {
        const nullProto = Object.create(null) as Record<string, unknown>
        expect(isKeysOf(nullProto, 'toString')).toBe(false)
    })

    it('returns false for constructor on Object.create(null)', () => {
        const nullProto = Object.create(null) as Record<string, unknown>
        expect(isKeysOf(nullProto, 'constructor')).toBe(false)
    })

    it('returns true for own keys on Object.create(null)', () => {
        const nullProto = Object.create(null) as Record<string, unknown>
        nullProto.a = 1
        nullProto.b = 2
        expect(isKeysOf(nullProto, 'a', 'b')).toBe(true)
    })

    it('returns true when no keys are provided on Object.create(null) (vacuous truth)', () => {
        const nullProto = Object.create(null) as Record<string, unknown>
        expect(isKeysOf(nullProto)).toBe(true)
    })

    it('returns false when a symbol key is missing', () => {
        const sym = Symbol('missing')
        expect(isKeysOf({ a: 1 }, sym)).toBe(false)
    })

    it('returns false for deleted keys', () => {
        const obj: Record<string, number> = { a: 1, b: 2 }
        delete obj.b

        expect(isKeysOf(obj, 'a', 'b')).toBe(false)
    })

    it('handles a large number of keys', () => {
        const obj: Record<string, number> = {}
        const keys: string[] = []

        for (let i = 0; i < 100; i++) {
            const key = `key${i}`
            obj[key] = i
            keys.push(key)
        }

        expect(isKeysOf(obj, ...keys)).toBe(true)
    })

    it('returns false when one key is missing among many', () => {
        const obj: Record<string, number> = {}
        const keys: string[] = []

        for (let i = 0; i < 100; i++) {
            const key = `key${i}`
            obj[key] = i
            keys.push(key)
        }

        keys.push('nonexistent')

        expect(isKeysOf(obj, ...keys)).toBe(false)
    })
})
