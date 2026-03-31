import { describe, expect, it } from 'bun:test'
import { trim } from '../../../src/strings/manipulations'

describe('trim', () => {
    it('trims both sides of whitespace by default', () => {
        expect(trim('   hello   ')).toBe('hello')
    })

    it('trims mixed whitespace on both sides', () => {
        expect(trim('\t\n  hello  \r\n')).toBe('hello')
    })

    it('returns empty string when all whitespace', () => {
        expect(trim('   \t\n\r  ')).toBe('')
    })

    it('returns the original string when no trimming needed', () => {
        expect(trim('hello')).toBe('hello')
    })

    it('trims custom characters from a Set', () => {
        expect(trim('---hello---', new Set(['-']))).toBe('hello')
    })

    it('trims custom characters from a string', () => {
        expect(trim('abcHelloabc', 'abc')).toBe('Hello')
    })

    it('handles empty string', () => {
        expect(trim('')).toBe('')
    })

    it('trims only leading when no trailing match', () => {
        expect(trim('   hello')).toBe('hello')
    })

    it('trims only trailing when no leading match', () => {
        expect(trim('hello   ')).toBe('hello')
    })
})
