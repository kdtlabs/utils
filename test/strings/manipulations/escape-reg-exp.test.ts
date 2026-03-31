import { describe, expect, it } from 'bun:test'
import { escapeRegExp } from '../../../src/strings/manipulations'

describe('escapeRegExp', () => {
    it('escapes special regex characters', () => {
        expect(escapeRegExp('hello.world')).toBe(String.raw`hello\.world`)
        expect(escapeRegExp('a+b')).toBe(String.raw`a\+b`)
        expect(escapeRegExp('a*b')).toBe(String.raw`a\*b`)
        expect(escapeRegExp('a?b')).toBe(String.raw`a\?b`)
    })

    it('escapes brackets and braces', () => {
        expect(escapeRegExp('[test]')).toBe(String.raw`\[test\]`)
        expect(escapeRegExp('{test}')).toBe(String.raw`\{test\}`)
        expect(escapeRegExp('(test)')).toBe(String.raw`\(test\)`)
    })

    it('escapes caret, dollar, pipe, and backslash', () => {
        expect(escapeRegExp('^start')).toBe(String.raw`\^start`)
        expect(escapeRegExp('end$')).toBe(String.raw`end\$`)
        expect(escapeRegExp('a|b')).toBe(String.raw`a\|b`)
        expect(escapeRegExp(String.raw`a\b`)).toBe(String.raw`a\\b`)
    })

    it('escapes hyphen', () => {
        expect(escapeRegExp('a-b')).toBe(String.raw`a\x2db`)
    })

    it('returns empty string for empty input', () => {
        expect(escapeRegExp('')).toBe('')
    })

    it('does not escape normal characters', () => {
        expect(escapeRegExp('hello')).toBe('hello')
    })

    it('produces patterns that match literally', () => {
        const input = 'price: $10.00 (USD)'
        const regex = new RegExp(escapeRegExp(input), 'u')

        expect(regex.test(input)).toBe(true)
    })
})
