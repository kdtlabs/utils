import { describe, expect, it } from 'bun:test'
import { concatBuffers } from '@/buffers/operations'

describe('concatBuffers', () => {
    describe('multiple buffers of the same type', () => {
        it('concatenates multiple Uint8Arrays', () => {
            const a = new Uint8Array([1, 2, 3])
            const b = new Uint8Array([4, 5, 6])
            const result = concatBuffers([a, b])

            expect(result).toBeInstanceOf(Uint8Array)
            expect([...result]).toEqual([1, 2, 3, 4, 5, 6])
        })

        it('concatenates multiple Buffers', () => {
            const a = Buffer.from([10, 20])
            const b = Buffer.from([30, 40])
            const result = concatBuffers([a, b])

            expect(result).toBeInstanceOf(Uint8Array)
            expect([...result]).toEqual([10, 20, 30, 40])
        })

        it('concatenates multiple ArrayBuffers', () => {
            const a = new Uint8Array([1, 2]).buffer
            const b = new Uint8Array([3, 4]).buffer
            const result = concatBuffers([a, b])

            expect(result).toBeInstanceOf(Uint8Array)
            expect([...result]).toEqual([1, 2, 3, 4])
        })

        it('concatenates three or more buffers', () => {
            const a = new Uint8Array([1])
            const b = new Uint8Array([2])
            const c = new Uint8Array([3])
            const result = concatBuffers([a, b, c])

            expect([...result]).toEqual([1, 2, 3])
        })
    })

    describe('mixed BufferLike types', () => {
        it('concatenates Buffer + ArrayBuffer + Uint8Array', () => {
            const buf = Buffer.from([1, 2])
            const ab = new Uint8Array([3, 4]).buffer
            const u8 = new Uint8Array([5, 6])
            const result = concatBuffers([buf, ab, u8])

            expect(result).toBeInstanceOf(Uint8Array)
            expect([...result]).toEqual([1, 2, 3, 4, 5, 6])
        })

        it('concatenates SharedArrayBuffer + DataView + Int32Array', () => {
            const sab = new SharedArrayBuffer(2)
            new Uint8Array(sab).set([10, 20])

            const dvBuf = new ArrayBuffer(2)
            new Uint8Array(dvBuf).set([30, 40])
            const dv = new DataView(dvBuf)

            const i32 = new Int32Array([1])
            const result = concatBuffers([sab, dv, i32])

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(2 + 2 + 4)
            expect(result[0]).toBe(10)
            expect(result[1]).toBe(20)
            expect(result[2]).toBe(30)
            expect(result[3]).toBe(40)
        })
    })

    describe('single-element array', () => {
        it('returns a new Uint8Array, not a reference to the original', () => {
            const original = new Uint8Array([1, 2, 3])
            const result = concatBuffers([original])

            expect(result).toBeInstanceOf(Uint8Array)
            expect([...result]).toEqual([1, 2, 3])
            expect(result).not.toBe(original)
        })

        it('does not share underlying memory with the original', () => {
            const original = new Uint8Array([1, 2, 3])
            const result = concatBuffers([original])

            result[0] = 99
            expect(original[0]).toBe(1)
        })
    })

    describe('empty array', () => {
        it('returns an empty Uint8Array', () => {
            const result = concatBuffers([])

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(0)
        })
    })

    describe('multiple empty buffers', () => {
        it('returns an empty Uint8Array when all inputs are empty', () => {
            const a = new Uint8Array(0)
            const b = Buffer.alloc(0)
            const c = new ArrayBuffer(0)
            const result = concatBuffers([a, b, c])

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(0)
        })

        it('preserves content when mixing empty and non-empty buffers', () => {
            const empty = new Uint8Array(0)
            const data = new Uint8Array([1, 2, 3])
            const result = concatBuffers([empty, data, empty])

            expect([...result]).toEqual([1, 2, 3])
        })
    })

    describe('multi-byte content', () => {
        it('preserves emoji bytes across concatenation', () => {
            const encoder = new TextEncoder()
            const hello = encoder.encode('Hello ')
            const emoji = encoder.encode('🌍')
            const result = concatBuffers([hello, emoji])

            const decoded = new TextDecoder().decode(result)
            expect(decoded).toBe('Hello 🌍')
        })

        it('preserves multi-byte characters split across buffers', () => {
            const encoder = new TextEncoder()
            const a = encoder.encode('こんにちは')
            const b = encoder.encode('世界')
            const result = concatBuffers([a, b])

            const decoded = new TextDecoder().decode(result)
            expect(decoded).toBe('こんにちは世界')
        })
    })

    describe('result properties', () => {
        it('has correct byteLength equal to sum of inputs', () => {
            const a = new Uint8Array([1, 2, 3])
            const b = new Uint8Array([4, 5])
            const result = concatBuffers([a, b])

            expect(result.byteLength).toBe(5)
        })

        it('has byteOffset of 0', () => {
            const a = new Uint8Array([1, 2])
            const b = new Uint8Array([3, 4])
            const result = concatBuffers([a, b])

            expect(result.byteOffset).toBe(0)
        })

        it('handles input with non-zero byteOffset', () => {
            const base = new Uint8Array([0, 1, 2, 3, 4])
            const a = base.subarray(2)
            const b = new Uint8Array([5, 6])
            const result = concatBuffers([a, b])

            expect([...result]).toEqual([2, 3, 4, 5, 6])
        })

        it('correctly concatenates large buffers', () => {
            const a = new Uint8Array(10_000).fill(1)
            const b = new Uint8Array(10_000).fill(2)
            const result = concatBuffers([a, b])

            expect(result.byteLength).toBe(20_000)
            expect(result[0]).toBe(1)
            expect(result[9999]).toBe(1)
            expect(result[10_000]).toBe(2)
            expect(result[19_999]).toBe(2)
        })
    })
})
