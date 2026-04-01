import { describe, expect, it } from 'bun:test'
import { stripAnsi } from '../../src/strings/strip-ansi'

describe('stripAnsi', () => {
    it('strips SGR color codes', () => {
        expect(stripAnsi('\u001B[31mHello\u001B[0m')).toBe('Hello')
    })

    it('strips SGR bold/underline/etc', () => {
        expect(stripAnsi('\u001B[1m\u001B[4mBold Underline\u001B[0m')).toBe('Bold Underline')
    })

    it('strips complex SGR with multiple params', () => {
        expect(stripAnsi('\u001B[1;4;38;2;255;100;0mStyled\u001B[0m')).toBe('Styled')
    })

    it('strips cursor movement sequences', () => {
        expect(stripAnsi('\u001B[2Ahello\u001B[3B')).toBe('hello')
    })

    it('strips erase sequences', () => {
        expect(stripAnsi('\u001B[2Jhello\u001B[K')).toBe('hello')
    })

    it('strips OSC 8 hyperlinks terminated by ST', () => {
        expect(stripAnsi('\u001B]8;;https://example.com\u001B\\Click here\u001B]8;;\u001B\\')).toBe('Click here')
    })

    it('strips OSC 8 hyperlinks terminated by BEL', () => {
        expect(stripAnsi('\u001B]8;;https://example.com\u0007Click here\u001B]8;;\u0007')).toBe('Click here')
    })

    it('strips character set designation', () => {
        expect(stripAnsi('\u001B(Bhello')).toBe('hello')
    })

    it('strips single-character escapes', () => {
        expect(stripAnsi('\u001BMhello\u001BD')).toBe('hello')
    })

    it('handles mixed ANSI + plain text', () => {
        expect(stripAnsi('\u001B[1mBold\u001B[0m normal \u001B[31mred\u001B[0m')).toBe('Bold normal red')
    })

    it('handles consecutive ANSI sequences', () => {
        expect(stripAnsi('\u001B[31m\u001B[42m\u001B[1mHello\u001B[0m')).toBe('Hello')
    })

    it('returns same reference when no ANSI present', () => {
        const str = 'Hello, world!'

        expect(stripAnsi(str)).toBe(str)
    })

    it('returns empty string for empty input', () => {
        expect(stripAnsi('')).toBe('')
    })

    it('returns empty string when input is only ANSI codes', () => {
        expect(stripAnsi('\u001B[31m\u001B[42m\u001B[1m\u001B[0m')).toBe('')
    })

    it('handles multiline strings with ANSI', () => {
        expect(stripAnsi('\u001B[31mline1\u001B[0m\n\u001B[32mline2\u001B[0m')).toBe('line1\nline2')
    })
})
