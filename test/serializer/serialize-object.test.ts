import { describe, expect, it } from 'bun:test'
import { serializeObject } from '../../src/serializer/serializers/object'
import { createTestContext, identitySerialize } from './helpers'

describe('serializeObject', () => {
    it('serializes flat plain object', () => {
        const ctx = createTestContext()
        const result = serializeObject({ a: 1, b: 'hello' }, ctx, identitySerialize)
        expect(result).toEqual({ a: 1, b: 'hello' })
    })

    it('serializes object with symbol keys', () => {
        const sym = Symbol('id')
        const ctx = createTestContext()
        const result = serializeObject({ name: 'test', [sym]: 42 }, ctx, identitySerialize)
        expect(result).toHaveProperty(['[Symbol(id)]'])
        expect(result).toHaveProperty('name', 'test')
    })

    it('handles null prototype object', () => {
        const obj = Object.create(null)
        obj.a = 1
        obj.b = 2
        const ctx = createTestContext()
        const result = serializeObject(obj, ctx, identitySerialize)
        expect(result).toEqual({ a: 1, b: 2 })
    })

    it('catches property access errors', () => {
        const obj = new Proxy({}, {
            get(_, key) {
                if (key === 'bad') {
                    throw new Error('access denied')
                }

                return 'ok'
            },
            getOwnPropertyDescriptor() {
                return { configurable: true, enumerable: true }
            },
            ownKeys() {
                return ['good', 'bad']
            },
        })

        const ctx = createTestContext({ onPropertyAccess: 'placeholder' })
        const result = serializeObject(obj, ctx, identitySerialize)
        expect(result).toHaveProperty('good', 'ok')
        expect((result.bad as Record<string, unknown>).type).toBe('property-access-error')
    })

    it('throws on property access error with throw strategy', () => {
        const obj = new Proxy({}, {
            get() {
                throw new Error('boom')
            },
            getOwnPropertyDescriptor() {
                return { configurable: true, enumerable: true }
            },
            ownKeys() {
                return ['x']
            },
        })

        const ctx = createTestContext({ onPropertyAccess: 'throw' })
        expect(() => serializeObject(obj, ctx, identitySerialize)).toThrow()
    })

    it('omits property on access error with omit strategy', () => {
        const obj = new Proxy({}, {
            get(_, key) {
                if (key === 'bad') {
                    throw new Error('nope')
                }

                return 'ok'
            },
            getOwnPropertyDescriptor() {
                return { configurable: true, enumerable: true }
            },
            ownKeys() {
                return ['good', 'bad']
            },
        })

        const ctx = createTestContext({ onPropertyAccess: 'omit' })
        const result = serializeObject(obj, ctx, identitySerialize)
        expect(result).toHaveProperty('good')
        expect(result).not.toHaveProperty('bad')
    })

    it('handles empty object', () => {
        const ctx = createTestContext()
        expect(serializeObject({}, ctx, identitySerialize)).toEqual({})
    })
})
