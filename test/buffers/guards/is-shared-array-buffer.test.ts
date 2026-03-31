import { describe, expect, it } from 'bun:test'
import { isSharedArrayBuffer } from '../../../src/buffers/guards'

describe('isSharedArrayBuffer', () => {
    it('returns true for a SharedArrayBuffer', () => {
        expect(isSharedArrayBuffer(new SharedArrayBuffer(8))).toBe(true)
    })

    it('returns true for a zero-length SharedArrayBuffer', () => {
        expect(isSharedArrayBuffer(new SharedArrayBuffer(0))).toBe(true)
    })

    it('returns false for an ArrayBuffer', () => {
        expect(isSharedArrayBuffer(new ArrayBuffer(8))).toBe(false)
    })

    it('returns false for a Buffer', () => {
        expect(isSharedArrayBuffer(Buffer.from('hello'))).toBe(false)
    })

    it('returns false for a Uint8Array', () => {
        expect(isSharedArrayBuffer(new Uint8Array(8))).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isSharedArrayBuffer('hello')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isSharedArrayBuffer(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isSharedArrayBuffer(undefined)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isSharedArrayBuffer({})).toBe(false)
    })
})
