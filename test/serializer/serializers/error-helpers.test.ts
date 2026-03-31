import type { Jsonable } from '@/core/types'
import type { SerializeContext } from '@/serializer/types'
import { describe, expect, it } from 'bun:test'
import { OMIT_SENTINEL } from '@/serializer/constants'
import { isUsableValue, readProperty, serializeErrorCoreFields } from '@/serializer/serializers/error'
import { createTestContext, identitySerialize } from '../helpers'

describe('isUsableValue', () => {
    it('returns true for string', () => {
        expect(isUsableValue('hello')).toBe(true)
    })

    it('returns true for number', () => {
        expect(isUsableValue(42)).toBe(true)
    })

    it('returns true for null', () => {
        expect(isUsableValue(null)).toBe(true)
    })

    it('returns true for boolean', () => {
        expect(isUsableValue(true)).toBe(true)
        expect(isUsableValue(false)).toBe(true)
    })

    it('returns true for object', () => {
        expect(isUsableValue({ a: 1 })).toBe(true)
    })

    it('returns true for zero', () => {
        expect(isUsableValue(0)).toBe(true)
    })

    it('returns true for empty string', () => {
        expect(isUsableValue('')).toBe(true)
    })

    it('returns false for undefined', () => {
        expect(isUsableValue(undefined)).toBe(false)
    })

    it('returns false for OMIT_SENTINEL', () => {
        expect(isUsableValue(OMIT_SENTINEL)).toBe(false)
    })
})

describe('readProperty', () => {
    it('returns serialized value for existing property', () => {
        const ctx = createTestContext()
        const error = new Error('test')
        const result = readProperty(error, 'message', ctx, identitySerialize)

        expect(result).toBe('test')
    })

    it('returns undefined for missing property', () => {
        const ctx = createTestContext()
        const error = new Error('test')
        const result = readProperty(error, 'nonexistent', ctx, identitySerialize)

        expect(result).toBeUndefined()
    })

    it('returns undefined when property value is undefined', () => {
        const ctx = createTestContext()
        const error = new Error('test') as Error & { extra?: string }

        error.extra = undefined
        const result = readProperty(error, 'extra', ctx, identitySerialize)

        expect(result).toBeUndefined()
    })

    it('delegates serialization through serializeValue', () => {
        const ctx = createTestContext()
        const error = new Error('test') as Error & { code: number }

        error.code = 42

        const doubler: (v: unknown, c: SerializeContext) => Jsonable = (v) => {
            if (typeof v === 'number') {
                return v * 2
            }

            return v as Jsonable
        }

        const result = readProperty(error, 'code', ctx, doubler)

        expect(result).toBe(84)
    })

    it('handles throwing getter with placeholder strategy', () => {
        const ctx = createTestContext({ onPropertyAccess: 'placeholder' })
        const error = new Error('test')

        Object.defineProperty(error, 'bad', {
            enumerable: true,
            get() {
                throw new Error('denied')
            },
        })

        const result = readProperty(error, 'bad', ctx, identitySerialize) as Record<string, unknown>

        expect(result.type).toBe('property-access-error')
    })

    it('throws on property access error with throw strategy', () => {
        const ctx = createTestContext({ onPropertyAccess: 'throw' })
        const error = new Error('test')

        Object.defineProperty(error, 'bad', {
            enumerable: true,
            get() {
                throw new Error('denied')
            },
        })

        expect(() => readProperty(error, 'bad', ctx, identitySerialize)).toThrow('denied')
    })

    it('returns OMIT_SENTINEL on property access error with omit strategy', () => {
        const ctx = createTestContext({ onPropertyAccess: 'omit' })
        const error = new Error('test')

        Object.defineProperty(error, 'bad', {
            enumerable: true,
            get() {
                throw new Error('denied')
            },
        })

        const result = readProperty(error, 'bad', ctx, identitySerialize)

        expect(result).toBe(OMIT_SENTINEL)
    })
})

describe('serializeErrorCoreFields', () => {
    it('includes name for basic error', () => {
        const ctx = createTestContext()
        const result = serializeErrorCoreFields(new Error('hello'), ctx, identitySerialize)

        expect(result.name).toBe('Error')
    })

    it('includes message when non-empty', () => {
        const ctx = createTestContext()
        const result = serializeErrorCoreFields(new Error('hello'), ctx, identitySerialize)

        expect(result.message).toBe('hello')
    })

    it('omits message when empty', () => {
        const ctx = createTestContext()
        const error = Object.assign(new Error('x'), { message: '' })
        const result = serializeErrorCoreFields(error, ctx, identitySerialize)

        expect(result).not.toHaveProperty('message')
    })

    it('includes stack when present', () => {
        const ctx = createTestContext()
        const result = serializeErrorCoreFields(new Error('test'), ctx, identitySerialize)

        expect(result.stack).toBeTypeOf('string')
        expect((result.stack as string).length).toBeGreaterThan(0)
    })

    it('includes cause when present', () => {
        const ctx = createTestContext()
        const error = new Error('wrapper', { cause: 'root' })
        const result = serializeErrorCoreFields(error, ctx, identitySerialize)

        expect(result.cause).toBe('root')
    })

    it('omits cause when undefined', () => {
        const ctx = createTestContext()
        const result = serializeErrorCoreFields(new Error('no cause'), ctx, identitySerialize)

        expect(result).not.toHaveProperty('cause')
    })

    it('preserves TypeError name', () => {
        const ctx = createTestContext()
        const result = serializeErrorCoreFields(new TypeError('bad'), ctx, identitySerialize)

        expect(result.name).toBe('TypeError')
    })

    it('includes errors array for AggregateError', () => {
        const ctx = createTestContext()
        const agg = new AggregateError([new Error('a'), new Error('b')], 'multi')
        const result = serializeErrorCoreFields(agg, ctx, identitySerialize)

        expect(result.name).toBe('AggregateError')
        expect(Array.isArray(result.errors)).toBe(true)
        expect((result.errors as unknown[]).length).toBe(2)
    })

    it('does not include errors for non-AggregateError', () => {
        const ctx = createTestContext()
        const result = serializeErrorCoreFields(new Error('test'), ctx, identitySerialize)

        expect(result).not.toHaveProperty('errors')
    })
})
