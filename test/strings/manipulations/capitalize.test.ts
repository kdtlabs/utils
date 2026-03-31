import { describe, expect, it } from 'bun:test'
import { capitalize } from '../../../src/strings/manipulations'

describe('capitalize', () => {
    it('capitalizes first character', () => {
        expect(capitalize('hello')).toBe('Hello')
    })

    it('does not change already capitalized string', () => {
        expect(capitalize('Hello')).toBe('Hello')
    })

    it('handles single character', () => {
        expect(capitalize('a')).toBe('A')
    })

    it('handles empty string', () => {
        expect(capitalize('')).toBe('')
    })

    it('only capitalizes first character, leaves rest unchanged', () => {
        expect(capitalize('hELLO')).toBe('HELLO')
    })

    it('handles numeric first character', () => {
        expect(capitalize('123abc')).toBe('123abc')
    })
})
