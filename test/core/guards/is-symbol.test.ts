import { describe, expect, it } from 'bun:test'
import { isSymbol } from '../../../src/core/guards'

describe('isSymbol', () => {
    it('returns true for a symbol', () => {
        expect(isSymbol(Symbol('x'))).toBe(true)
    })

    it('returns true for Symbol.iterator', () => {
        expect(isSymbol(Symbol.iterator)).toBe(true)
    })

    it('returns false for a string', () => {
        expect(isSymbol('symbol')).toBe(false)
    })
})
