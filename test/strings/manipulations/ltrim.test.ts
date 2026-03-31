import { describe, expect, it } from 'bun:test'
import { ltrim } from '@/strings/manipulations'

describe('ltrim', () => {
    it('trims leading whitespace by default', () => {
        expect(ltrim('   hello')).toBe('hello')
    })

    it('trims leading mixed whitespace', () => {
        expect(ltrim('\t\n  hello')).toBe('hello')
    })

    it('does not trim trailing whitespace', () => {
        expect(ltrim('hello   ')).toBe('hello   ')
    })

    it('returns empty string when all whitespace', () => {
        expect(ltrim('   \t\n\r  ')).toBe('')
    })

    it('returns the original string when no leading whitespace', () => {
        expect(ltrim('hello')).toBe('hello')
    })

    it('trims custom characters from a Set', () => {
        expect(ltrim('---hello---', new Set(['-']))).toBe('hello---')
    })

    it('trims custom characters from a string', () => {
        expect(ltrim('abcHello', 'abc')).toBe('Hello')
    })

    it('handles empty string', () => {
        expect(ltrim('')).toBe('')
    })

    it('returns the same reference when no trimming needed', () => {
        const str = 'hello'

        expect(ltrim(str)).toBe(str)
    })
})
