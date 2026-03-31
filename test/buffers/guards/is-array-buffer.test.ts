import { describe, expect, it } from 'bun:test'
import { isArrayBuffer } from '../../../src/buffers/guards'

describe('isArrayBuffer', () => {
    it('returns true for an ArrayBuffer', () => {
        expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true)
    })

    it('returns true for a zero-length ArrayBuffer', () => {
        expect(isArrayBuffer(new ArrayBuffer(0))).toBe(true)
    })

    it('returns false for a SharedArrayBuffer', () => {
        expect(isArrayBuffer(new SharedArrayBuffer(8))).toBe(false)
    })

    it('returns false for a Buffer', () => {
        expect(isArrayBuffer(Buffer.from('hello'))).toBe(false)
    })

    it('returns false for a Uint8Array', () => {
        expect(isArrayBuffer(new Uint8Array(8))).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isArrayBuffer('hello')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isArrayBuffer(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isArrayBuffer(undefined)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isArrayBuffer({})).toBe(false)
    })
})
