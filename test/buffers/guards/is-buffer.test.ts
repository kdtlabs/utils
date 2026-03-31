import { describe, expect, it } from 'bun:test'
import { isBuffer } from '@/buffers/guards'

describe('isBuffer', () => {
    it('returns true for a Buffer', () => {
        expect(isBuffer(Buffer.from('hello'))).toBe(true)
    })

    it('returns true for an empty Buffer', () => {
        expect(isBuffer(Buffer.alloc(0))).toBe(true)
    })

    it('returns false for an ArrayBuffer', () => {
        expect(isBuffer(new ArrayBuffer(8))).toBe(false)
    })

    it('returns false for a Uint8Array', () => {
        expect(isBuffer(new Uint8Array(8))).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isBuffer('hello')).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isBuffer(42)).toBe(false)
    })

    it('returns false for null', () => {
        expect(isBuffer(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isBuffer(undefined)).toBe(false)
    })

    it('returns false for a plain object', () => {
        expect(isBuffer({})).toBe(false)
    })
})
