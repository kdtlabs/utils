import { describe, expect, it } from 'bun:test'
import { isEmptyString } from '@/strings/guards'

describe('isEmptyString', () => {
    it('returns true for empty string', () => {
        expect(isEmptyString('')).toBe(true)
    })

    it('returns false for non-empty string', () => {
        expect(isEmptyString('hello')).toBe(false)
    })

    it('returns false for whitespace-only string', () => {
        expect(isEmptyString(' ')).toBe(false)
    })

    it('returns false for newline string', () => {
        expect(isEmptyString('\n')).toBe(false)
    })
})
