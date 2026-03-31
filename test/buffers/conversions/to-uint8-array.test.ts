import { describe, expect, it } from 'bun:test'
import { toUint8Array } from '@/buffers/conversions'

describe('toUint8Array', () => {
    describe('Uint8Array input', () => {
        it('returns the same reference', () => {
            const input = new Uint8Array([1, 2, 3])
            expect(toUint8Array(input)).toBe(input)
        })

        it('returns the same reference for empty Uint8Array', () => {
            const input = new Uint8Array(0)
            expect(toUint8Array(input)).toBe(input)
        })
    })

    describe('Buffer input', () => {
        it('returns the same reference (Buffer extends Uint8Array)', () => {
            const input = Buffer.from([1, 2, 3])
            expect(toUint8Array(input)).toBe(input)
        })

        it('returns the same reference for empty Buffer', () => {
            const input = Buffer.alloc(0)
            expect(toUint8Array(input)).toBe(input)
        })

        it('preserves content', () => {
            const input = Buffer.from('hello world')
            const result = toUint8Array(input)
            expect(result).toEqual(new TextEncoder().encode('hello world'))
        })
    })

    describe('ArrayBuffer input', () => {
        it('wraps as Uint8Array', () => {
            const data = new Uint8Array([10, 20, 30])
            const ab = data.buffer
            const result = toUint8Array(ab)

            expect(result).toBeInstanceOf(Uint8Array)
            expect([...result]).toEqual([10, 20, 30])
        })

        it('shares underlying memory', () => {
            const ab = new ArrayBuffer(4)
            const result = toUint8Array(ab)

            result[0] = 42
            expect(new Uint8Array(ab)[0]).toBe(42)
        })

        it('handles empty ArrayBuffer', () => {
            const ab = new ArrayBuffer(0)
            const result = toUint8Array(ab)

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(0)
        })
    })

    describe('SharedArrayBuffer input', () => {
        it('wraps as Uint8Array', () => {
            const sab = new SharedArrayBuffer(4)
            new Uint8Array(sab).set([5, 6, 7, 8])
            const result = toUint8Array(sab)

            expect(result).toBeInstanceOf(Uint8Array)
            expect([...result]).toEqual([5, 6, 7, 8])
        })

        it('shares underlying memory', () => {
            const sab = new SharedArrayBuffer(4)
            const result = toUint8Array(sab)

            result[0] = 99
            expect(new Uint8Array(sab)[0]).toBe(99)
        })

        it('handles empty SharedArrayBuffer', () => {
            const sab = new SharedArrayBuffer(0)
            const result = toUint8Array(sab)

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(0)
        })
    })

    describe('DataView input', () => {
        it('wraps as Uint8Array over the same buffer', () => {
            const ab = new ArrayBuffer(4)
            new Uint8Array(ab).set([1, 2, 3, 4])
            const dv = new DataView(ab)
            const result = toUint8Array(dv)

            expect(result).toBeInstanceOf(Uint8Array)
            expect([...result]).toEqual([1, 2, 3, 4])
        })

        it('respects byteOffset', () => {
            const ab = new ArrayBuffer(8)
            new Uint8Array(ab).set([0, 0, 10, 20, 30, 0, 0, 0])
            const dv = new DataView(ab, 2, 3)
            const result = toUint8Array(dv)

            expect(result.byteLength).toBe(3)
            expect([...result]).toEqual([10, 20, 30])
        })

        it('shares underlying memory', () => {
            const ab = new ArrayBuffer(4)
            const dv = new DataView(ab)
            const result = toUint8Array(dv)

            result[0] = 77
            expect(new Uint8Array(ab)[0]).toBe(77)
        })

        it('handles empty DataView', () => {
            const ab = new ArrayBuffer(4)
            const dv = new DataView(ab, 0, 0)
            const result = toUint8Array(dv)

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(0)
        })
    })

    describe('Int32Array input', () => {
        it('wraps as Uint8Array using byteLength not element count', () => {
            const i32 = new Int32Array([1, 2, 3])
            const result = toUint8Array(i32)

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(12)
        })

        it('shares underlying memory', () => {
            const i32 = new Int32Array([0])
            const result = toUint8Array(i32)

            result[0] = 42
            const view = new Uint8Array(i32.buffer)
            expect(view[0]).toBe(42)
        })

        it('handles empty Int32Array', () => {
            const i32 = new Int32Array(0)
            const result = toUint8Array(i32)

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(0)
        })
    })

    describe('Float64Array input', () => {
        it('wraps as Uint8Array using byteLength', () => {
            const f64 = new Float64Array([1.5, 2.5])
            const result = toUint8Array(f64)

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(16)
        })

        it('shares underlying memory', () => {
            const f64 = new Float64Array([0])
            const result = toUint8Array(f64)

            result[0] = 42
            expect(new Uint8Array(f64.buffer)[0]).toBe(42)
        })

        it('handles empty Float64Array', () => {
            const f64 = new Float64Array(0)
            const result = toUint8Array(f64)

            expect(result).toBeInstanceOf(Uint8Array)
            expect(result.byteLength).toBe(0)
        })
    })

    describe('typed array with offset', () => {
        it('respects byteOffset of a sub-view', () => {
            const ab = new ArrayBuffer(16)
            new Uint8Array(ab).set([0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0])
            const i32 = new Int32Array(ab, 4, 2)
            const result = toUint8Array(i32)

            expect(result.byteLength).toBe(8)
            expect(result.buffer).toBe(ab)
            expect(result.byteOffset).toBe(4)
        })
    })
})
