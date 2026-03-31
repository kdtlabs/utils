import { describe, expect, it } from 'bun:test'
import { serializeCollection } from '@/serializer/serializers/collection'
import { createTestContext, identitySerialize } from '../helpers'

describe('serializeCollection', () => {
    it('serializes Map as pairs', () => {
        const ctx = createTestContext()
        const map = new Map([['a', 1], ['b', 2]])
        const result = serializeCollection(map, ctx, identitySerialize)

        expect(result).toEqual({
            __serialized__: true,
            metadata: { name: 'Map', size: 2 },
            type: 'map',
            value: [['a', 1], ['b', 2]],
        })
    })

    it('serializes empty Map', () => {
        const ctx = createTestContext()
        const result = serializeCollection(new Map(), ctx, identitySerialize)

        expect(result).toEqual({
            __serialized__: true,
            metadata: { name: 'Map', size: 0 },
            type: 'map',
            value: [],
        })
    })

    it('serializes Map with non-string keys', () => {
        const ctx = createTestContext()
        const objKey = { id: 1 }
        const map = new Map<unknown, unknown>([[42, 'num'], [objKey, 'obj']])
        const result = serializeCollection(map, ctx, identitySerialize)

        expect(result).toEqual({
            __serialized__: true,
            metadata: { name: 'Map', size: 2 },
            type: 'map',
            value: [[42, 'num'], [objKey, 'obj']],
        })
    })

    it('includes metadata.name and metadata.size for Map', () => {
        const ctx = createTestContext()
        const map = new Map([['x', 10]])
        const result = serializeCollection(map, ctx, identitySerialize) as Record<string, unknown>

        expect(result.metadata).toEqual({ name: 'Map', size: 1 })
    })

    it('serializes Set as array of items', () => {
        const ctx = createTestContext()
        const set = new Set([1, true, 'two'])
        const result = serializeCollection(set, ctx, identitySerialize)

        expect(result).toEqual({
            __serialized__: true,
            metadata: { name: 'Set', size: 3 },
            type: 'set',
            value: [1, true, 'two'],
        })
    })

    it('serializes empty Set', () => {
        const ctx = createTestContext()
        const result = serializeCollection(new Set(), ctx, identitySerialize)

        expect(result).toEqual({
            __serialized__: true,
            metadata: { name: 'Set', size: 0 },
            type: 'set',
            value: [],
        })
    })

    it('includes metadata.name and metadata.size for Set', () => {
        const ctx = createTestContext()
        const set = new Set(['a', 'b'])
        const result = serializeCollection(set, ctx, identitySerialize) as Record<string, unknown>

        expect(result.metadata).toEqual({ name: 'Set', size: 2 })
    })

    it('returns undefined for plain object', () => {
        const ctx = createTestContext()

        expect(serializeCollection({}, ctx, identitySerialize)).toBeUndefined()
        expect(serializeCollection({ a: 1 }, ctx, identitySerialize)).toBeUndefined()
    })

    it('returns undefined for array', () => {
        const ctx = createTestContext()

        expect(serializeCollection([], ctx, identitySerialize)).toBeUndefined()
        expect(serializeCollection([1, 2, 3], ctx, identitySerialize)).toBeUndefined()
    })

    it('returns undefined for collection-like that is neither map-like nor set-like', () => {
        const ctx = createTestContext()

        const collectionOnly = {
            size: 3,
            * [Symbol.iterator]() {
                yield 1
                yield 2
                yield 3
            },
        }

        const result = serializeCollection(collectionOnly, ctx, identitySerialize)

        expect(result).toBeUndefined()
    })
})
