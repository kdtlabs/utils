import { describe, expect, it } from 'bun:test'
import { parseExponential } from '@/numbers/conversions'

describe('parseExponential', () => {
    it('returns non-exponential string unchanged', () => {
        expect(parseExponential('123.45')).toBe('123.45')
    })

    it('returns integer string unchanged', () => {
        expect(parseExponential('42')).toBe('42')
    })

    it('expands positive exponent without fraction', () => {
        expect(parseExponential('5e3')).toBe('5000')
    })

    it('expands positive exponent with fraction', () => {
        expect(parseExponential('1.5e2')).toBe('150')
    })

    it('expands positive exponent with partial fraction shift', () => {
        expect(parseExponential('1.234e2')).toBe('123.4')
    })

    it('expands negative exponent', () => {
        expect(parseExponential('5e-3')).toBe('0.005')
    })

    it('expands negative exponent with fraction', () => {
        expect(parseExponential('1.5e-2')).toBe('0.015')
    })

    it('handles negative number with positive exponent', () => {
        expect(parseExponential('-3.5e2')).toBe('-350')
    })

    it('handles negative number with negative exponent', () => {
        expect(parseExponential('-3.5e-2')).toBe('-0.035')
    })

    it('handles zero exponent', () => {
        expect(parseExponential('1.5e0')).toBe('1.5')
    })

    it('handles number input', () => {
        expect(parseExponential(1.5e3)).toBe('1500')
    })

    it('handles bigint input', () => {
        expect(parseExponential(123n)).toBe('123')
    })

    it('handles uppercase E', () => {
        expect(parseExponential('1.5E2')).toBe('150')
    })

    it('handles negative number with no fraction and negative exponent', () => {
        expect(parseExponential('-5e-3')).toBe('-0.005')
    })

    it('returns raw string when mantissa is empty', () => {
        expect(parseExponential('e5' as never)).toBe('e5')
    })

    it('handles positive sign in exponent', () => {
        expect(parseExponential('2e+3')).toBe('2000')
    })
})
