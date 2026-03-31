import { describe, expect, it } from 'bun:test'
import { isArrayBufferView } from '../../../src/buffers/guards'

describe('isArrayBufferView', () => {
    it('returns true for a Uint8Array', () => {
        expect(isArrayBufferView(new Uint8Array(8))).toBe(true)
    })

    it('returns true for a Int32Array', () => {
        expect(isArrayBufferView(new Int32Array(4))).toBe(true)
    })

    it('returns true for a Float64Array', () => {
        expect(isArrayBufferView(new Float64Array(2))).toBe(true)
    })

    it('returns true for a DataView', () => {
        expect(isArrayBufferView(new DataView(new ArrayBuffer(8)))).toBe(true)
    })

    it('returns true for a Buffer (Buffer extends Uint8Array)', () => {
        expect(isArrayBufferView(Buffer.from('hello'))).toBe(true)
    })

    it('returns false for an ArrayBuffer', () => {
        expect(isArrayBufferView(new ArrayBuffer(8))).toBe(false)
    })

    it('returns false for a SharedArrayBuffer', () => {
        expect(isArrayBufferView(new SharedArrayBuffer(8))).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isArrayBufferView('hello')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isArrayBufferView(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isArrayBufferView(undefined)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isArrayBufferView({})).toBe(false)
    })
})
