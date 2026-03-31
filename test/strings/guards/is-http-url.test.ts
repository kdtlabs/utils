import { describe, expect, it } from 'bun:test'
import { isHttpUrl } from '@/strings/guards'

describe('isHttpUrl', () => {
    it('returns true for http URL', () => {
        expect(isHttpUrl('http://example.com')).toBe(true)
    })

    it('returns true for https URL', () => {
        expect(isHttpUrl('https://example.com')).toBe(true)
    })

    it('returns false for ws URL', () => {
        expect(isHttpUrl('ws://example.com')).toBe(false)
    })

    it('returns false for ftp URL', () => {
        expect(isHttpUrl('ftp://example.com')).toBe(false)
    })

    it('returns false for invalid URL', () => {
        expect(isHttpUrl('not-a-url')).toBe(false)
    })

    it('accepts URL objects', () => {
        expect(isHttpUrl(new URL('https://example.com'))).toBe(true)
    })
})
