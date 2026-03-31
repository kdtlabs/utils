import { describe, expect, it } from 'bun:test'
import { serializeBlob } from '../../../src/serializer/serializers/blob'
import { createTestContext } from '../helpers'

describe('serializeBlob', () => {
    it('serializes Blob with metadata', () => {
        const ctx = createTestContext()
        const blob = new Blob(['hello world'], { type: 'application/octet-stream' })
        const result = serializeBlob(blob, ctx)

        expect(result).toEqual({
            __serialized__: true,
            metadata: { size: 11, type: 'application/octet-stream' },
            type: 'blob',
            value: null,
        })
    })

    it('serializes empty Blob', () => {
        const ctx = createTestContext()
        const blob = new Blob([])
        const result = serializeBlob(blob, ctx)

        expect(result).toEqual({
            __serialized__: true,
            metadata: { size: 0, type: '' },
            type: 'blob',
            value: null,
        })
    })

    it('serializes File with metadata including name', () => {
        const ctx = createTestContext()
        const file = new File(['content'], 'readme.txt', { type: 'application/octet-stream' })
        const result = serializeBlob(file, ctx)

        expect(result).toEqual({
            __serialized__: true,
            metadata: { name: 'readme.txt', size: 7, type: 'application/octet-stream' },
            type: 'file',
            value: null,
        })
    })

    it('returns undefined for plain object', () => {
        const ctx = createTestContext()
        expect(serializeBlob({ size: 10, type: 'fake' }, ctx)).toBeUndefined()
    })

    it('returns undefined for array', () => {
        const ctx = createTestContext()
        expect(serializeBlob([1, 2, 3], ctx)).toBeUndefined()
    })
})
