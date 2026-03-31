import { describe, expect, it } from 'bun:test'
import { toSubscriptDigits } from '@/numbers/conversions'

describe('toSubscriptDigits', () => {
    it('converts a single digit', () => {
        expect(toSubscriptDigits(5)).toBe('\u2085')
    })

    it('converts multiple digits', () => {
        expect(toSubscriptDigits(123)).toBe('\u2081\u2082\u2083')
    })

    it('converts zero', () => {
        expect(toSubscriptDigits(0)).toBe('\u2080')
    })

    it('preserves non-digit characters', () => {
        expect(toSubscriptDigits(-5)).toBe('-\u2085')
    })

    it('converts a string input', () => {
        expect(toSubscriptDigits('42')).toBe('\u2084\u2082')
    })

    it('converts a bigint input', () => {
        expect(toSubscriptDigits(99n)).toBe('\u2089\u2089')
    })

    it('preserves decimal point', () => {
        expect(toSubscriptDigits('3.14')).toBe('\u2083.\u2081\u2084')
    })
})
