import { describe, expect, it } from 'bun:test'
import { serializeBinary } from '../../../src/serializer/serializers/binary'
import { createTestContext } from '../helpers'

describe('serializeBinary', () => {
    it('serializes Uint8Array', () => {
        const ctx = createTestContext()

        expect(serializeBinary(new Uint8Array([1, 2, 3]), ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 3, byteOffset: 0 },
            type: 'uint8array',
            value: [1, 2, 3],
        })
    })

    it('serializes Int8Array', () => {
        const ctx = createTestContext()

        expect(serializeBinary(new Int8Array([-1, 0, 127]), ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 3, byteOffset: 0 },
            type: 'int8array',
            value: [-1, 0, 127],
        })
    })

    it('serializes Int32Array', () => {
        const ctx = createTestContext()

        expect(serializeBinary(new Int32Array([100, -200]), ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 8, byteOffset: 0 },
            type: 'int32array',
            value: [100, -200],
        })
    })

    it('serializes Float64Array', () => {
        const ctx = createTestContext()

        expect(serializeBinary(new Float64Array([1.5, 2.5]), ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 16, byteOffset: 0 },
            type: 'float64array',
            value: [1.5, 2.5],
        })
    })

    it('serializes Uint16Array', () => {
        const ctx = createTestContext()

        expect(serializeBinary(new Uint16Array([256, 512]), ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 4, byteOffset: 0 },
            type: 'uint16array',
            value: [256, 512],
        })
    })

    it('serializes typed array with byteOffset and byteLength metadata', () => {
        const buffer = new ArrayBuffer(12)
        const view = new Uint32Array(buffer, 4, 2)

        view[0] = 10
        view[1] = 20

        const ctx = createTestContext()

        expect(serializeBinary(view, ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 8, byteOffset: 4 },
            type: 'uint32array',
            value: [10, 20],
        })
    })

    it('serializes empty typed array', () => {
        const ctx = createTestContext()

        expect(serializeBinary(new Uint8Array([]), ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 0, byteOffset: 0 },
            type: 'uint8array',
            value: [],
        })
    })

    it('serializes ArrayBuffer', () => {
        const buffer = new ArrayBuffer(3)
        const bytes = new Uint8Array(buffer)

        bytes[0] = 10
        bytes[1] = 20
        bytes[2] = 30

        const ctx = createTestContext()

        expect(serializeBinary(buffer, ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 3 },
            type: 'arraybuffer',
            value: [10, 20, 30],
        })
    })

    it('serializes empty ArrayBuffer', () => {
        const ctx = createTestContext()

        expect(serializeBinary(new ArrayBuffer(0), ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 0 },
            type: 'arraybuffer',
            value: [],
        })
    })

    it('serializes DataView', () => {
        const buffer = new ArrayBuffer(8)
        const view = new DataView(buffer, 2, 4)
        const ctx = createTestContext()

        expect(serializeBinary(view, ctx)).toEqual({
            __serialized__: true,
            metadata: { byteLength: 4, byteOffset: 2 },
            type: 'dataview',
            value: null,
        })
    })

    it('returns undefined for plain object', () => {
        const ctx = createTestContext()
        expect(serializeBinary({ a: 1 }, ctx)).toBeUndefined()
    })

    it('returns undefined for array', () => {
        const ctx = createTestContext()
        expect(serializeBinary([1, 2, 3], ctx)).toBeUndefined()
    })
})
