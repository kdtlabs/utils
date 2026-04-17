import { describe, expect, test } from 'bun:test'
import { isBinaryContent } from '../../../src/buffers/operations'

describe('isBinaryContent', () => {
    test('returns false for empty buffer', () => {
        expect(isBinaryContent(new Uint8Array(0))).toBe(false)
    })

    test('returns false for plain ASCII text', () => {
        expect(isBinaryContent(Buffer.from('hello world'))).toBe(false)
    })

    test('returns false for UTF-8 multibyte text', () => {
        expect(isBinaryContent(Buffer.from('xin chào — 世界'))).toBe(false)
    })

    test('returns true when NUL byte exists in scanned range', () => {
        expect(isBinaryContent(Buffer.from([0x48, 0x00, 0x49]))).toBe(true)
    })

    test('returns true for PNG signature (NUL in header)', () => {
        expect(isBinaryContent(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]))).toBe(true)
    })

    test('ignores NUL bytes beyond maxBytes', () => {
        const u8 = new Uint8Array(100).fill(0x41)
        u8[50] = 0

        expect(isBinaryContent(u8, 10)).toBe(false)
        expect(isBinaryContent(u8, 100)).toBe(true)
    })

    test('honors custom maxBytes when buffer is smaller', () => {
        expect(isBinaryContent(Buffer.from([0x41, 0x00]), 10)).toBe(true)
    })

    test('accepts ArrayBuffer input', () => {
        const ab = new ArrayBuffer(3)
        new Uint8Array(ab).set([0x41, 0x00, 0x42])

        expect(isBinaryContent(ab)).toBe(true)
    })

    test('accepts DataView input', () => {
        const ab = new ArrayBuffer(3)
        new Uint8Array(ab).set([0x41, 0x42, 0x43])

        expect(isBinaryContent(new DataView(ab))).toBe(false)
    })

    test('accepts Uint8Array subarray input', () => {
        const u8 = new Uint8Array([0x00, 0x41, 0x42, 0x43])

        expect(isBinaryContent(u8.subarray(1))).toBe(false)
        expect(isBinaryContent(u8.subarray(0, 2))).toBe(true)
    })
})
