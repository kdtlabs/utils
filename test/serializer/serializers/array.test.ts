import type { Jsonable } from '../../../src/core/types'
import { describe, expect, it } from 'bun:test'
import { OMIT_SENTINEL } from '../../../src/serializer/constants'
import { serializeArray, serializeArrayEntry, serializeIterableEntries } from '../../../src/serializer/serializers/array'
import { createTestContext, identitySerialize } from '../helpers'

describe('serializeArray', () => {
    it('serializes array with primitive elements', () => {
        const ctx = createTestContext()
        const result = serializeArray([1, 'hello', true, null], ctx, identitySerialize)
        expect(result).toEqual([1, 'hello', true, null])
    })

    it('serializes empty array', () => {
        const ctx = createTestContext()
        const result = serializeArray([], ctx, identitySerialize)
        expect(result).toEqual([])
    })

    it('serializes nested arrays', () => {
        const ctx = createTestContext()
        const result = serializeArray([[1, 2], [3, 4]], ctx, identitySerialize)
        expect(result).toEqual([[1, 2], [3, 4]])
    })
})

describe('serializeArrayEntry', () => {
    it('passes through primitive values via identitySerialize', () => {
        const ctx = createTestContext()
        expect(serializeArrayEntry(42, ctx, identitySerialize)).toBe(42)
        expect(serializeArrayEntry('text', ctx, identitySerialize)).toBe('text')
        expect(serializeArrayEntry(true, ctx, identitySerialize)).toBe(true)
        expect(serializeArrayEntry(null, ctx, identitySerialize)).toBeNull()
    })

    it('replaces OMIT_SENTINEL with null', () => {
        const ctx = createTestContext()
        const omitSerialize = (): Jsonable => OMIT_SENTINEL as unknown as Jsonable
        const result = serializeArrayEntry('anything', ctx, omitSerialize)
        expect(result).toBeNull()
    })
})

describe('serializeIterableEntries', () => {
    it('serializes iterable into array', () => {
        const ctx = createTestContext()
        const set = new Set([1, 2, 3])
        const result = serializeIterableEntries(set, ctx, identitySerialize)
        expect(result).toEqual([1, 2, 3])
    })

    it('serializes empty iterable', () => {
        const ctx = createTestContext()
        const result = serializeIterableEntries(new Set(), ctx, identitySerialize)
        expect(result).toEqual([])
    })

    it('replaces OMIT_SENTINEL entries with null', () => {
        const ctx = createTestContext()
        let callCount = 0

        const mixedSerialize = (value: unknown): Jsonable => {
            callCount++

            if (callCount === 2) {
                return OMIT_SENTINEL as unknown as Jsonable
            }

            return value as Jsonable
        }

        const result = serializeIterableEntries([10, 20, 30], ctx, mixedSerialize)
        expect(result).toEqual([10, null, 30])
    })
})
