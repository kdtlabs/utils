import { describe, expect, it } from 'bun:test'
import { serializeLeafObject } from '@/serializer/serializers/leaf-object'
import { createTestContext } from '../helpers'

describe('serializeLeafObject', () => {
    it('serializes Date', () => {
        const ctx = createTestContext()
        const date = new Date('2024-01-15')
        const result = serializeLeafObject(date, ctx)
        expect(result).toEqual({ __serialized__: true, type: 'date', value: date.toISOString() })
    })

    it('serializes Date with time component', () => {
        const ctx = createTestContext()
        const date = new Date('2024-06-15T13:45:30.123Z')
        const result = serializeLeafObject(date, ctx)

        expect(result).toEqual({
            __serialized__: true,
            type: 'date',
            value: '2024-06-15T13:45:30.123Z',
        })
    })

    it('throws on invalid Date', () => {
        const ctx = createTestContext()
        const invalid = new Date('not-a-date')
        expect(() => serializeLeafObject(invalid, ctx)).toThrow()
    })

    it('serializes RegExp with flags', () => {
        const ctx = createTestContext()
        const result = serializeLeafObject(/foo/giu, ctx)
        expect(result).toEqual({ __serialized__: true, type: 'regexp', value: '/foo/giu' })
    })

    it('serializes RegExp with unicode flag', () => {
        const ctx = createTestContext()
        const result = serializeLeafObject(/\p{L}+/u, ctx)
        expect(result).toEqual({ __serialized__: true, type: 'regexp', value: String.raw`/\p{L}+/u` })
    })

    it('serializes URL', () => {
        const ctx = createTestContext()
        const url = new URL('https://example.com')
        const result = serializeLeafObject(url, ctx)
        expect(result).toEqual({ __serialized__: true, type: 'url', value: 'https://example.com/' })
    })

    it('serializes URL with query and hash', () => {
        const ctx = createTestContext()
        const url = new URL('https://example.com/path?key=value#section')
        const result = serializeLeafObject(url, ctx)

        expect(result).toEqual({
            __serialized__: true,
            type: 'url',
            value: 'https://example.com/path?key=value#section',
        })
    })

    it('returns undefined for plain object', () => {
        const ctx = createTestContext()
        expect(serializeLeafObject({ a: 1 }, ctx)).toBeUndefined()
    })

    it('returns undefined for array', () => {
        const ctx = createTestContext()
        expect(serializeLeafObject([1, 2, 3], ctx)).toBeUndefined()
    })

    it('returns undefined for number', () => {
        const ctx = createTestContext()
        expect(serializeLeafObject(42, ctx)).toBeUndefined()
    })

    it('returns undefined for string', () => {
        const ctx = createTestContext()
        expect(serializeLeafObject('hello', ctx)).toBeUndefined()
    })
})
