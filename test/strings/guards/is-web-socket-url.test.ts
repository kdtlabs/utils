import { describe, expect, it } from 'bun:test'
import { isWebSocketUrl } from '@/strings/guards'

describe('isWebSocketUrl', () => {
    it('returns true for ws URL', () => {
        expect(isWebSocketUrl('ws://example.com')).toBe(true)
    })

    it('returns true for wss URL', () => {
        expect(isWebSocketUrl('wss://example.com')).toBe(true)
    })

    it('returns false for http URL', () => {
        expect(isWebSocketUrl('http://example.com')).toBe(false)
    })

    it('returns false for https URL', () => {
        expect(isWebSocketUrl('https://example.com')).toBe(false)
    })

    it('returns false for invalid URL', () => {
        expect(isWebSocketUrl('not-a-url')).toBe(false)
    })

    it('accepts URL objects', () => {
        expect(isWebSocketUrl(new URL('ws://example.com'))).toBe(true)
    })
})
