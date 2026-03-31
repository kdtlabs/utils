import { describe, expect, it } from 'bun:test'
import { padStart } from '../../../src/strings/manipulations'

describe('padStart', () => {
    it('pads with spaces by default', () => {
        expect(padStart('abc', 6)).toBe('   abc')
    })

    it('pads with custom character', () => {
        expect(padStart('abc', 6, '0')).toBe('000abc')
    })

    it('returns original when already at target length', () => {
        expect(padStart('abc', 3)).toBe('abc')
    })

    it('returns original when longer than target length', () => {
        expect(padStart('abcdef', 3)).toBe('abcdef')
    })

    it('handles empty string', () => {
        expect(padStart('', 3, '0')).toBe('000')
    })
})
