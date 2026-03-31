import { describe, expect, it } from 'bun:test'
import { bufferEquals } from '../../../src/buffers/operations'

describe('bufferEquals', () => {
    describe('equal buffers', () => {
        it('returns true for same reference', () => {
            const buf = new Uint8Array([1, 2, 3])

            expect(bufferEquals(buf, buf)).toBe(true)
        })

        it('returns true for same content Uint8Arrays', () => {
            const a = new Uint8Array([1, 2, 3])
            const b = new Uint8Array([1, 2, 3])

            expect(bufferEquals(a, b)).toBe(true)
        })

        it('returns true for two empty buffers', () => {
            const a = new Uint8Array(0)
            const b = new Uint8Array(0)

            expect(bufferEquals(a, b)).toBe(true)
        })

        it('returns true for two empty ArrayBuffers', () => {
            const a = new ArrayBuffer(0)
            const b = new ArrayBuffer(0)

            expect(bufferEquals(a, b)).toBe(true)
        })
    })

    describe('different BufferLike types with same content', () => {
        it('returns true for Buffer vs Uint8Array', () => {
            const a = Buffer.from([10, 20, 30])
            const b = new Uint8Array([10, 20, 30])

            expect(bufferEquals(a, b)).toBe(true)
        })

        it('returns true for ArrayBuffer vs Uint8Array', () => {
            const ab = new ArrayBuffer(3)
            new Uint8Array(ab).set([1, 2, 3])
            const u8 = new Uint8Array([1, 2, 3])

            expect(bufferEquals(ab, u8)).toBe(true)
        })

        it('returns true for Buffer vs ArrayBuffer', () => {
            const buf = Buffer.from([5, 6, 7])
            const ab = new ArrayBuffer(3)
            new Uint8Array(ab).set([5, 6, 7])

            expect(bufferEquals(buf, ab)).toBe(true)
        })

        it('returns true for SharedArrayBuffer vs Uint8Array', () => {
            const sab = new SharedArrayBuffer(3)
            new Uint8Array(sab).set([1, 2, 3])
            const u8 = new Uint8Array([1, 2, 3])

            expect(bufferEquals(sab, u8)).toBe(true)
        })

        it('returns true for DataView vs Buffer', () => {
            const ab = new ArrayBuffer(3)
            new Uint8Array(ab).set([10, 20, 30])
            const dv = new DataView(ab)
            const buf = Buffer.from([10, 20, 30])

            expect(bufferEquals(dv, buf)).toBe(true)
        })

        it('returns true for subarrays with non-zero byteOffset', () => {
            const base = new Uint8Array([0, 1, 2, 3])
            const a = base.subarray(1)
            const b = new Uint8Array([1, 2, 3])

            expect(bufferEquals(a, b)).toBe(true)
        })
    })

    describe('different lengths', () => {
        it('returns false for different byte lengths', () => {
            const a = new Uint8Array([1, 2, 3])
            const b = new Uint8Array([1, 2, 3, 4])

            expect(bufferEquals(a, b)).toBe(false)
        })

        it('returns false when one buffer is a prefix of the other', () => {
            const a = new Uint8Array([1, 2, 3])
            const b = new Uint8Array([1, 2, 3, 4, 5])

            expect(bufferEquals(a, b)).toBe(false)
        })

        it('returns false for empty vs non-empty', () => {
            const a = new Uint8Array(0)
            const b = new Uint8Array([1])

            expect(bufferEquals(a, b)).toBe(false)
        })
    })

    describe('different content', () => {
        it('returns false for single-byte difference at the last position', () => {
            const a = new Uint8Array([1, 2, 3, 4, 5])
            const b = new Uint8Array([1, 2, 3, 4, 6])

            expect(bufferEquals(a, b)).toBe(false)
        })

        it('returns false for single-byte difference at the first position', () => {
            const a = new Uint8Array([1, 2, 3])
            const b = new Uint8Array([9, 2, 3])

            expect(bufferEquals(a, b)).toBe(false)
        })

        it('returns false for completely different content', () => {
            const a = new Uint8Array([0, 0, 0])
            const b = new Uint8Array([255, 255, 255])

            expect(bufferEquals(a, b)).toBe(false)
        })

        it('returns false for large buffers with difference at the end', () => {
            const a = new Uint8Array(10_000).fill(42)
            const b = new Uint8Array(10_000).fill(42)
            b[9999] = 99

            expect(bufferEquals(a, b)).toBe(false)
        })
    })
})
