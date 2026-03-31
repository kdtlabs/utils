import { describe, expect, it } from 'bun:test'
import { bufferToString } from '../../../src/buffers/conversions'

describe('bufferToString', () => {
    const TEXT = 'hello world'
    const EMOJI = '🎉🚀'

    describe('Buffer input', () => {
        it('converts with default utf8 encoding', () => {
            expect(bufferToString(Buffer.from(TEXT))).toBe(TEXT)
        })

        it('converts with explicit utf8 encoding', () => {
            expect(bufferToString(Buffer.from(TEXT), 'utf8')).toBe(TEXT)
        })

        it('converts with base64 encoding', () => {
            const buf = Buffer.from(TEXT)
            expect(bufferToString(buf, 'base64')).toBe(buf.toString('base64'))
        })

        it('converts with hex encoding', () => {
            const buf = Buffer.from(TEXT)
            expect(bufferToString(buf, 'hex')).toBe(buf.toString('hex'))
        })

        it('converts multi-byte content', () => {
            expect(bufferToString(Buffer.from(EMOJI))).toBe(EMOJI)
        })

        it('converts empty Buffer', () => {
            expect(bufferToString(Buffer.alloc(0))).toBe('')
        })
    })

    describe('ArrayBuffer input', () => {
        it('converts with default utf8 encoding', () => {
            const buf = Buffer.from(TEXT)
            const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

            expect(bufferToString(ab)).toBe(TEXT)
        })

        it('converts with base64 encoding', () => {
            const buf = Buffer.from(TEXT)
            const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

            expect(bufferToString(ab, 'base64')).toBe(buf.toString('base64'))
        })

        it('converts with hex encoding', () => {
            const buf = Buffer.from(TEXT)
            const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

            expect(bufferToString(ab, 'hex')).toBe(buf.toString('hex'))
        })

        it('converts empty ArrayBuffer', () => {
            expect(bufferToString(new ArrayBuffer(0))).toBe('')
        })

        it('converts multi-byte content', () => {
            const buf = Buffer.from(EMOJI)
            const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

            expect(bufferToString(ab)).toBe(EMOJI)
        })
    })

    describe('SharedArrayBuffer input', () => {
        it('converts with default utf8 encoding', () => {
            const src = Buffer.from(TEXT)
            const sab = new SharedArrayBuffer(src.byteLength)

            new Uint8Array(sab).set(src)

            expect(bufferToString(sab)).toBe(TEXT)
        })

        it('converts with base64 encoding', () => {
            const src = Buffer.from(TEXT)
            const sab = new SharedArrayBuffer(src.byteLength)

            new Uint8Array(sab).set(src)

            expect(bufferToString(sab, 'base64')).toBe(src.toString('base64'))
        })

        it('converts empty SharedArrayBuffer', () => {
            expect(bufferToString(new SharedArrayBuffer(0))).toBe('')
        })
    })

    describe('ArrayBufferView input', () => {
        it('converts a Uint8Array', () => {
            const u8 = new TextEncoder().encode(TEXT)

            expect(bufferToString(u8)).toBe(TEXT)
        })

        it('converts a Uint8Array with non-zero byteOffset', () => {
            const ab = new ArrayBuffer(16)
            const full = new Uint8Array(ab)
            const src = Buffer.from(TEXT)

            full.set(src, 4)

            const view = new Uint8Array(ab, 4, src.byteLength)

            expect(bufferToString(view)).toBe(TEXT)
        })

        it('converts a DataView', () => {
            const src = Buffer.from(TEXT)
            const ab = new ArrayBuffer(src.byteLength)

            new Uint8Array(ab).set(src)

            const dv = new DataView(ab)

            expect(bufferToString(dv)).toBe(TEXT)
        })

        it('converts with base64 encoding', () => {
            const u8 = new TextEncoder().encode(TEXT)

            expect(bufferToString(u8, 'base64')).toBe(Buffer.from(TEXT).toString('base64'))
        })

        it('converts with hex encoding', () => {
            const u8 = new TextEncoder().encode(TEXT)

            expect(bufferToString(u8, 'hex')).toBe(Buffer.from(TEXT).toString('hex'))
        })

        it('converts empty Uint8Array', () => {
            expect(bufferToString(new Uint8Array(0))).toBe('')
        })

        it('converts multi-byte content', () => {
            const u8 = new TextEncoder().encode(EMOJI)

            expect(bufferToString(u8)).toBe(EMOJI)
        })
    })
})
