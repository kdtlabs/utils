import { describe, expect, it } from 'bun:test'
import { serializeNumber } from '@/serializer/serializers/number'
import { createTestContext } from '../helpers'

describe('serializeNumber', () => {
    it('passes through finite positive integer', () => {
        const ctx = createTestContext()
        expect(serializeNumber(42, ctx)).toBe(42)
    })

    it('passes through zero', () => {
        const ctx = createTestContext()
        expect(serializeNumber(0, ctx)).toBe(0)
    })

    it('passes through negative float', () => {
        const ctx = createTestContext()
        expect(serializeNumber(-3.14, ctx)).toBe(-3.14)
    })

    it('passes through negative zero', () => {
        const ctx = createTestContext()
        expect(serializeNumber(-0, ctx)).toBe(-0)
    })

    it('passes through Number.MAX_SAFE_INTEGER', () => {
        const ctx = createTestContext()
        expect(serializeNumber(Number.MAX_SAFE_INTEGER, ctx)).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('passes through Number.MIN_SAFE_INTEGER', () => {
        const ctx = createTestContext()
        expect(serializeNumber(Number.MIN_SAFE_INTEGER, ctx)).toBe(Number.MIN_SAFE_INTEGER)
    })

    it('passes through Number.MAX_VALUE', () => {
        const ctx = createTestContext()
        expect(serializeNumber(Number.MAX_VALUE, ctx)).toBe(Number.MAX_VALUE)
    })

    it('passes through Number.MIN_VALUE', () => {
        const ctx = createTestContext()
        expect(serializeNumber(Number.MIN_VALUE, ctx)).toBe(Number.MIN_VALUE)
    })

    it('serializes NaN with type number and value NaN', () => {
        const ctx = createTestContext()

        expect(serializeNumber(Number.NaN, ctx)).toEqual({
            __serialized__: true,
            type: 'number',
            value: 'NaN',
        })
    })

    it('serializes Infinity with value Infinity', () => {
        const ctx = createTestContext()

        expect(serializeNumber(Infinity, ctx)).toEqual({
            __serialized__: true,
            type: 'number',
            value: 'Infinity',
        })
    })

    it('serializes -Infinity with value -Infinity', () => {
        const ctx = createTestContext()

        expect(serializeNumber(-Infinity, ctx)).toEqual({
            __serialized__: true,
            type: 'number',
            value: '-Infinity',
        })
    })
})
