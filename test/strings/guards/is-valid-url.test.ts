import { describe, expect, it } from 'bun:test'
import { isValidUrl } from '../../../src/strings/guards'

describe('isValidUrl', () => {
    it('returns true for valid http URL string', () => {
        expect(isValidUrl('http://example.com')).toBe(true)
    })

    it('returns true for valid https URL string', () => {
        expect(isValidUrl('https://example.com/path?q=1')).toBe(true)
    })

    it('returns true for URL object', () => {
        expect(isValidUrl(new URL('https://example.com'))).toBe(true)
    })

    it('returns false for invalid URL string', () => {
        expect(isValidUrl('not-a-url')).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(isValidUrl('')).toBe(false)
    })

    it('filters by allowed protocols', () => {
        expect(isValidUrl('https://example.com', ['https'])).toBe(true)
        expect(isValidUrl('http://example.com', ['https'])).toBe(false)
    })

    it('handles protocol filtering case-insensitively', () => {
        expect(isValidUrl('HTTPS://example.com', ['https'])).toBe(true)
    })

    it('returns true for any protocol when protocols is null', () => {
        expect(isValidUrl('ftp://example.com', null)).toBe(true)
    })

    it('returns true for any protocol when protocols is empty array', () => {
        expect(isValidUrl('ftp://example.com', [])).toBe(true)
    })

    it('filters URL object by protocol', () => {
        const url = new URL('ws://example.com')

        expect(isValidUrl(url, ['http', 'https'])).toBe(false)
    })
})
