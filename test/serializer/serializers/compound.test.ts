import type { Jsonable } from '../../../src/core/types'
import type { SerializedValue } from '../../../src/serializer/types'
import { describe, expect, it } from 'bun:test'
import { SERIALIZE } from '../../../src/serializer/constants'
import { serializeCompound } from '../../../src/serializer/serializers/compound'
import { createTestContext, identitySerialize } from '../helpers'

describe('serializeCompound', () => {
    it('uses custom [SERIALIZE] method when present', () => {
        const ctx = createTestContext()
        const obj = { [SERIALIZE]: () => 'custom-value' }
        const result = serializeCompound(obj, ctx, identitySerialize)

        expect(result).toBe('custom-value')
    })

    it('serializes arrays', () => {
        const ctx = createTestContext()
        const result = serializeCompound([1, 2, 3], ctx, identitySerialize)

        expect(result).toEqual([1, 2, 3])
    })

    it('serializes empty arrays', () => {
        const ctx = createTestContext()
        const result = serializeCompound([], ctx, identitySerialize)

        expect(result).toEqual([])
    })

    it('serializes Map as collection', () => {
        const ctx = createTestContext()
        const map = new Map([['a', 1]])
        const result = serializeCompound(map, ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('map')
    })

    it('serializes Set as collection', () => {
        const ctx = createTestContext()
        const set = new Set([1, 2])
        const result = serializeCompound(set, ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('set')
    })

    it('serializes ArrayBuffer as binary', () => {
        const ctx = createTestContext()
        const buffer = new ArrayBuffer(4)
        const result = serializeCompound(buffer, ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('arraybuffer')
    })

    it('serializes Uint8Array as binary', () => {
        const ctx = createTestContext()
        const typed = new Uint8Array([1, 2, 3])
        const result = serializeCompound(typed, ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('uint8array')
    })

    it('serializes Error instances', () => {
        const ctx = createTestContext()
        const result = serializeCompound(new Error('boom'), ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('error')
    })

    it('serializes plain objects', () => {
        const ctx = createTestContext()
        const result = serializeCompound({ a: 1, b: 'hello' }, ctx, identitySerialize)

        expect(result).toEqual({ a: 1, b: 'hello' })
    })

    it('serializes objects with toJSON method', () => {
        const ctx = createTestContext()

        const obj = Object.create(null, {
            toJSON: { value: () => ({ serialized: true }) },
        })

        Object.setPrototypeOf(obj, class Custom {}.prototype)

        const result = serializeCompound(obj, ctx, identitySerialize)

        expect(result).toEqual({ serialized: true })
    })

    it('serializes iterables with constructor name', () => {
        const ctx = createTestContext()

        class CustomIterable {
            public * [Symbol.iterator]() {
                yield 1
                yield 2
            }
        }

        const result = serializeCompound(new CustomIterable(), ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('iterable')
        expect((result.metadata!).name).toBe('CustomIterable')
    })

    it('delegates to onUnserializable when provided', () => {
        const ctx = createTestContext({
            onUnserializable: () => 'fallback' as Jsonable,
        })

        class Opaque {}

        const result = serializeCompound(new Opaque(), ctx, identitySerialize)

        expect(result).toBe('fallback')
    })

    it('falls back to type placeholder for unserializable without handler', () => {
        const ctx = createTestContext({ onUnserializable: false })

        class Unknown {}

        const result = serializeCompound(new Unknown(), ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('object')
        expect(result.value).toBe('[Unknown]')
    })

    it('prioritizes custom SERIALIZE over other strategies', () => {
        const ctx = createTestContext()

        const error = new Error('test');
        (error as unknown as Record<PropertyKey, unknown>)[SERIALIZE] = () => 'custom'

        const result = serializeCompound(error, ctx, identitySerialize)

        expect(result).toBe('custom')
    })

    it('serializes Promise as opaque', () => {
        const ctx = createTestContext()
        const p = Promise.resolve(42)
        const result = serializeCompound(p, ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('promise')
    })

    it('serializes WeakMap as opaque', () => {
        const ctx = createTestContext()
        const result = serializeCompound(new WeakMap(), ctx, identitySerialize) as unknown as SerializedValue

        expect(result.type).toBe('weakmap')
    })
})
