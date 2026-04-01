import { describe, expect, it } from 'bun:test'
import { indent } from '../../../src/strings/manipulations'

describe('indent', () => {
    it('indents a single line', () => {
        expect(indent('hello', 4)).toBe('    hello')
    })

    it('indents multiple lines', () => {
        expect(indent('line 1\nline 2\nline 3', 2)).toBe('  line 1\n  line 2\n  line 3')
    })

    it('preserves existing whitespace when trim is false', () => {
        expect(indent('  hello', 2)).toBe('    hello')
    })

    it('strips existing whitespace before indenting when trim is true', () => {
        expect(indent('    hello', 2, true)).toBe('  hello')
    })

    it('handles trim on multiline strings', () => {
        expect(indent('    line 1\n      line 2\n    line 3', 2, true)).toBe('  line 1\n  line 2\n  line 3')
    })

    it('returns empty string for empty input', () => {
        expect(indent('', 4)).toBe('    ')
    })

    it('handles count of 0', () => {
        expect(indent('hello', 0)).toBe('hello')
    })

    it('handles string with trailing newline', () => {
        expect(indent('hello\n', 2)).toBe('  hello\n  ')
    })

    it('handles string with only newlines', () => {
        expect(indent('\n\n', 2)).toBe('  \n  \n  ')
    })
})
