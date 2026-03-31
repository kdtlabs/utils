import { describe, expect, it } from 'bun:test'
import { serializeOpaque } from '../../../src/serializer/serializers/opaque'
import { createTestContext } from '../helpers'

function * nums() {
    yield 1
    yield 2
}

describe('serializeOpaque', () => {
    it('serializes function', () => {
        const ctx = createTestContext()
        const result = serializeOpaque(() => {}, ctx)

        expect(result).toEqual(expect.objectContaining({ type: 'function' }))
    })

    it('serializes Promise', () => {
        const ctx = createTestContext()
        const result = serializeOpaque(Promise.resolve(42), ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'promise',
            value: '[Promise]',
        }))
    })

    it('serializes rejected Promise as placeholder', () => {
        const ctx = createTestContext()
        const p = Promise.reject(new Error('fail'))
        p.catch(() => {})
        const result = serializeOpaque(p, ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'promise',
            value: '[Promise]',
        }))
    })

    it('serializes WeakMap', () => {
        const ctx = createTestContext()
        const result = serializeOpaque(new WeakMap(), ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'weakmap',
            value: '[WeakMap]',
        }))
    })

    it('serializes WeakSet', () => {
        const ctx = createTestContext()
        const result = serializeOpaque(new WeakSet(), ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'weakset',
            value: '[WeakSet]',
        }))
    })

    it('serializes WeakRef', () => {
        const ctx = createTestContext()
        const obj = {}
        const result = serializeOpaque(new WeakRef(obj), ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'weakref',
            value: '[WeakRef]',
        }))
    })

    it('serializes ReadableStream', () => {
        const ctx = createTestContext()
        const result = serializeOpaque(new ReadableStream(), ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'readablestream',
            value: '[ReadableStream]',
        }))
    })

    it('serializes generator instance without consuming it', () => {
        const ctx = createTestContext()
        const gen = nums()
        const result = serializeOpaque(gen, ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'generator',
            value: '[Generator]',
        }))

        expect(gen.next().value).toBe(1)
    })

    it('returns undefined for plain object', () => {
        const ctx = createTestContext()
        expect(serializeOpaque({ a: 1 }, ctx)).toBeUndefined()
    })

    it('returns undefined for array', () => {
        const ctx = createTestContext()
        expect(serializeOpaque([1, 2], ctx)).toBeUndefined()
    })

    it('returns undefined for Date', () => {
        const ctx = createTestContext()
        expect(serializeOpaque(new Date(), ctx)).toBeUndefined()
    })
})
