import type { Jsonable } from '@/core/types'
import type { SerializeContext } from '@/serializer/types'
import { describe, expect, it } from 'bun:test'
import { serializeError } from '@/serializer/serializers/error'
import { createTestContext, identitySerialize } from './helpers'

describe('serializeError', () => {
    it('serializes basic error with name and message', () => {
        const ctx = createTestContext()
        const result = serializeError(new Error('boom'), ctx, identitySerialize)
        expect(result.name).toBe('Error')
        expect(result.message).toBe('boom')
        expect(result.stack).toBeTypeOf('string')
    })

    it('serializes TypeError', () => {
        const ctx = createTestContext()
        const result = serializeError(new TypeError('bad type'), ctx, identitySerialize)
        expect(result.name).toBe('TypeError')
        expect(result.message).toBe('bad type')
    })

    it('serializes error with cause recursively', () => {
        const cause = new Error('root cause')
        const error = new Error('wrapper', { cause })
        const ctx = createTestContext()
        const result = serializeError(error, ctx, identitySerialize)
        expect(result.cause).toBeDefined()
        expect(result.cause).toBe(cause as unknown as Jsonable)
    })

    it('delegates cause to serializeValue callback', () => {
        const cause = new Error('root cause')
        const error = new Error('wrapper', { cause })
        const ctx = createTestContext()

        const mockSerialize: (value: unknown, c: SerializeContext) => Jsonable = (value) => {
            if (value instanceof Error) {
                return { message: value.message, name: value.name, type: 'error' } as Jsonable
            }

            return value as Jsonable
        }

        const result = serializeError(error, ctx, mockSerialize)
        expect(result.cause).toBeDefined()
        expect((result.cause as Record<string, unknown>).type).toBe('error')
    })

    it('serializes AggregateError with errors array', () => {
        const errors = [new Error('a'), new Error('b')]
        const agg = new AggregateError(errors, 'multiple')
        const ctx = createTestContext()
        const result = serializeError(agg, ctx, identitySerialize)
        expect(result.name).toBe('AggregateError')
        expect(result.message).toBe('multiple')
        expect(Array.isArray(result.errors)).toBe(true)
        expect((result.errors as unknown[]).length).toBe(2)
    })

    it('serializes custom error properties', () => {
        const error = new Error('with code') as Error & { code: string }
        error.code = 'ERR_CUSTOM'
        const ctx = createTestContext()
        const result = serializeError(error, ctx, identitySerialize)
        expect(result.code).toBe('ERR_CUSTOM')
    })

    it('serializes error with symbol keys', () => {
        const sym = Symbol('errorId')
        const error = Object.assign(new Error('test'), { [sym]: 42 })
        const ctx = createTestContext()
        const result = serializeError(error, ctx, identitySerialize)
        expect(result['[Symbol(errorId)]']).toBe(42)
    })

    it('handles error with undefined cause', () => {
        const ctx = createTestContext()
        const result = serializeError(new Error('no cause'), ctx, identitySerialize)
        expect(result).not.toHaveProperty('cause')
    })

    it('handles error with non-error cause', () => {
        const error = new Error('string cause', { cause: 'just a string' })
        const ctx = createTestContext()
        const result = serializeError(error, ctx, identitySerialize)
        expect(result.cause).toBe('just a string')
    })

    it('handles error with empty message', () => {
        const ctx = createTestContext()
        const error = Object.assign(new Error('placeholder'), { message: '' })
        const result = serializeError(error, ctx, identitySerialize)
        expect(result.name).toBe('Error')
    })

    it('catches throwing getter on custom property with placeholder strategy', () => {
        const error = new Error('test') as Error & { bad?: string }

        Object.defineProperty(error, 'bad', {
            enumerable: true,
            get() {
                throw new Error('denied')
            },
        })

        const ctx = createTestContext({ onPropertyAccess: 'placeholder' })
        const result = serializeError(error, ctx, identitySerialize)
        expect(result.name).toBe('Error')
        expect((result.bad as Record<string, unknown>).type).toBe('property-access-error')
    })

    it('throws on property access error with throw strategy', () => {
        const error = new Error('test') as Error & { bad?: string }

        Object.defineProperty(error, 'bad', {
            enumerable: true,
            get() {
                throw new Error('denied')
            },
        })

        const ctx = createTestContext({ onPropertyAccess: 'throw' })
        expect(() => serializeError(error, ctx, identitySerialize)).toThrow()
    })

    it('omits property on access error with omit strategy', () => {
        const error = new Error('test') as Error & { bad?: string }

        Object.defineProperty(error, 'bad', {
            enumerable: true,
            get() {
                throw new Error('denied')
            },
        })

        const ctx = createTestContext({ onPropertyAccess: 'omit' })
        const result = serializeError(error, ctx, identitySerialize)
        expect(result.name).toBe('Error')
        expect(result).not.toHaveProperty('bad')
    })

    it('catches property access error on cause getter', () => {
        const error = new Error('test')

        Object.defineProperty(error, 'cause', {
            get() {
                throw new Error('denied')
            },
        })

        const ctx = createTestContext({ onPropertyAccess: 'placeholder' })
        const result = serializeError(error, ctx, identitySerialize)
        expect((result.cause as Record<string, unknown>).type).toBe('property-access-error')
    })
})
