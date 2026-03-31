import { describe, expect, it } from 'bun:test'
import { isBufferLike } from '../../../src/buffers/guards'

describe('isBufferLike', () => {
    it('returns true for a Buffer', () => {
        expect(isBufferLike(Buffer.from('hello'))).toBe(true)
    })

    it('returns true for an ArrayBuffer', () => {
        expect(isBufferLike(new ArrayBuffer(8))).toBe(true)
    })

    it('returns true for a SharedArrayBuffer', () => {
        expect(isBufferLike(new SharedArrayBuffer(8))).toBe(true)
    })

    it('returns true for a Uint8Array', () => {
        expect(isBufferLike(new Uint8Array(8))).toBe(true)
    })

    it('returns true for a DataView', () => {
        expect(isBufferLike(new DataView(new ArrayBuffer(8)))).toBe(true)
    })

    it('returns true for a Int32Array', () => {
        expect(isBufferLike(new Int32Array(4))).toBe(true)
    })

    it('returns false for a string', () => {
        expect(isBufferLike('hello')).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isBufferLike(42)).toBe(false)
    })

    it('returns false for null', () => {
        expect(isBufferLike(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isBufferLike(undefined)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isBufferLike({})).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isBufferLike([1, 2, 3])).toBe(false)
    })

    it('returns false for a function', () => {
        expect(isBufferLike(() => {})).toBe(false)
    })
})
