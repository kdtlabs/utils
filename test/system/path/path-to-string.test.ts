import { describe, expect, it } from 'bun:test'
import { pathToString } from '../../../src/system/path'

describe('pathToString', () => {
    it('returns a string path as-is', () => {
        expect(pathToString('/usr/local/bin')).toBe('/usr/local/bin')
    })

    it('returns an empty string as-is', () => {
        expect(pathToString('')).toBe('')
    })

    it('converts a URL to its string representation', () => {
        const url = new URL('file:///home/user/project')
        expect(pathToString(url)).toBe('file:///home/user/project')
    })

    it('converts a Buffer to a string', () => {
        const buf = Buffer.from('/home/user/test')
        expect(pathToString(buf)).toBe('/home/user/test')
    })

    it('converts a Uint8Array to a string', () => {
        const arr = new TextEncoder().encode('/home/user/test')
        expect(pathToString(arr)).toBe('/home/user/test')
    })

    it('converts an ArrayBuffer to a string', () => {
        const buf = new TextEncoder().encode('/home/user/test')
        expect(pathToString(buf.buffer)).toBe('/home/user/test')
    })
})
