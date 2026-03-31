import { describe, expect, it } from 'bun:test'
import { rtrim } from '../../../src/strings/manipulations'

describe('rtrim', () => {
    it('trims trailing whitespace by default', () => {
        expect(rtrim('hello   ')).toBe('hello')
    })

    it('trims trailing mixed whitespace', () => {
        expect(rtrim('hello\t\n  ')).toBe('hello')
    })

    it('does not trim leading whitespace', () => {
        expect(rtrim('   hello')).toBe('   hello')
    })

    it('returns empty string when all whitespace', () => {
        expect(rtrim('   \t\n\r  ')).toBe('')
    })

    it('returns the original string when no trailing whitespace', () => {
        expect(rtrim('hello')).toBe('hello')
    })

    it('trims custom characters from a Set', () => {
        expect(rtrim('---hello---', new Set(['-']))).toBe('---hello')
    })

    it('trims custom characters from a string', () => {
        expect(rtrim('Helloabc', 'abc')).toBe('Hello')
    })

    it('handles empty string', () => {
        expect(rtrim('')).toBe('')
    })

    it('returns the same reference when no trimming needed', () => {
        const str = 'hello'

        expect(rtrim(str)).toBe(str)
    })
})
