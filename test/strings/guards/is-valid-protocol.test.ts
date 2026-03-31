import { describe, expect, it } from 'bun:test'
import { isValidProtocol } from '../../../src/strings/guards'

describe('isValidProtocol', () => {
    it('returns true when no protocols specified', () => {
        expect(isValidProtocol(new URL('https://example.com'))).toBe(true)
    })

    it('returns true when protocols is null', () => {
        expect(isValidProtocol(new URL('https://example.com'), null)).toBe(true)
    })

    it('returns true when protocols is empty array', () => {
        expect(isValidProtocol(new URL('https://example.com'), [])).toBe(true)
    })

    it('returns true when protocol matches', () => {
        expect(isValidProtocol(new URL('https://example.com'), ['https'])).toBe(true)
    })

    it('returns false when protocol does not match', () => {
        expect(isValidProtocol(new URL('http://example.com'), ['https'])).toBe(false)
    })

    it('matches case-insensitively', () => {
        expect(isValidProtocol(new URL('HTTPS://example.com'), ['https'])).toBe(true)
    })

    it('matches against multiple protocols', () => {
        expect(isValidProtocol(new URL('http://example.com'), ['http', 'https'])).toBe(true)
        expect(isValidProtocol(new URL('ftp://example.com'), ['http', 'https'])).toBe(false)
    })
})
