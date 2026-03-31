import { describe, expect, it } from 'bun:test'
import { serializePrimitive } from '@/serializer/serializers/primitive'
import { createTestContext } from '../helpers'

describe('serializePrimitive', () => {
    it('passes through string', () => {
        const ctx = createTestContext()
        expect(serializePrimitive('hello', ctx)).toBe('hello')
    })

    it('passes through empty string', () => {
        const ctx = createTestContext()
        expect(serializePrimitive('', ctx)).toBe('')
    })

    it('passes through boolean true and false', () => {
        const ctx = createTestContext()
        expect(serializePrimitive(true, ctx)).toBe(true)
        expect(serializePrimitive(false, ctx)).toBe(false)
    })

    it('passes through null', () => {
        const ctx = createTestContext()
        expect(serializePrimitive(null, ctx)).toBeNull()
    })

    it('passes through finite numbers', () => {
        const ctx = createTestContext()
        expect(serializePrimitive(42, ctx)).toBe(42)
        expect(serializePrimitive(0, ctx)).toBe(0)
        expect(serializePrimitive(-3.14, ctx)).toBe(-3.14)
    })

    it('passes through negative zero', () => {
        const ctx = createTestContext()
        expect(serializePrimitive(-0, ctx)).toBe(-0)
    })

    it('passes through Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER', () => {
        const ctx = createTestContext()
        expect(serializePrimitive(Number.MAX_SAFE_INTEGER, ctx)).toBe(Number.MAX_SAFE_INTEGER)
        expect(serializePrimitive(Number.MIN_SAFE_INTEGER, ctx)).toBe(Number.MIN_SAFE_INTEGER)
    })

    it('serializes NaN', () => {
        const ctx = createTestContext()
        const result = serializePrimitive(Number.NaN, ctx)
        expect(result).toEqual({ __serialized__: true, type: 'number', value: 'NaN' })
    })

    it('serializes Infinity and -Infinity', () => {
        const ctx = createTestContext()
        const pos = serializePrimitive(Infinity, ctx)
        const neg = serializePrimitive(-Infinity, ctx)
        expect(pos).toEqual({ __serialized__: true, type: 'number', value: 'Infinity' })
        expect(neg).toEqual({ __serialized__: true, type: 'number', value: '-Infinity' })
    })

    it('serializes undefined', () => {
        const ctx = createTestContext()
        const result = serializePrimitive(undefined, ctx)
        expect(result).toEqual({ __serialized__: true, type: 'undefined', value: null })
    })

    it('serializes bigint', () => {
        const ctx = createTestContext()
        const result = serializePrimitive(42n, ctx)
        expect(result).toEqual({ __serialized__: true, type: 'bigint', value: '42' })
    })

    it('serializes large bigint and negative bigint', () => {
        const ctx = createTestContext()
        const large = serializePrimitive(999_999_999_999_999_999_999n, ctx)
        const negative = serializePrimitive(-123n, ctx)
        expect(large).toEqual({ __serialized__: true, type: 'bigint', value: '999999999999999999999' })
        expect(negative).toEqual({ __serialized__: true, type: 'bigint', value: '-123' })
    })

    it('serializes symbol with description', () => {
        const ctx = createTestContext()
        const result = serializePrimitive(Symbol('myKey'), ctx)

        expect(result).toEqual({
            __serialized__: true,
            type: 'symbol',
            value: expect.any(String),
        })
    })

    it('serializes symbol without description', () => {
        const ctx = createTestContext()
        const result = serializePrimitive(Symbol('no-desc'), ctx)

        expect(result).toEqual({
            __serialized__: true,
            type: 'symbol',
            value: expect.any(String),
        })
    })

    it('serializes Symbol.for()', () => {
        const ctx = createTestContext()
        const result = serializePrimitive(Symbol.for('shared'), ctx)

        expect(result).toEqual({
            __serialized__: true,
            type: 'symbol',
            value: expect.any(String),
        })
    })

    it('returns undefined for objects', () => {
        const ctx = createTestContext()
        expect(serializePrimitive({}, ctx)).toBeUndefined()
        expect(serializePrimitive({ a: 1 }, ctx)).toBeUndefined()
    })

    it('returns undefined for arrays', () => {
        const ctx = createTestContext()
        expect(serializePrimitive([], ctx)).toBeUndefined()
        expect(serializePrimitive([1, 2, 3], ctx)).toBeUndefined()
    })

    it('returns undefined for functions', () => {
        const ctx = createTestContext()
        expect(serializePrimitive(() => {}, ctx)).toBeUndefined()
        expect(serializePrimitive(() => {}, ctx)).toBeUndefined()
    })
})
