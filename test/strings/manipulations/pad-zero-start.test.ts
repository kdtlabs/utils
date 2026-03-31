import { describe, expect, it } from 'bun:test'
import { padZeroStart } from '@/strings/manipulations'

describe('padZeroStart', () => {
    it('pads number with leading zeros', () => {
        expect(padZeroStart(5, 3)).toBe('005')
    })

    it('pads string with leading zeros', () => {
        expect(padZeroStart('5', 3)).toBe('005')
    })

    it('handles bigint', () => {
        expect(padZeroStart(5n, 3)).toBe('005')
    })

    it('returns original when already at target length', () => {
        expect(padZeroStart(123, 3)).toBe('123')
    })

    it('returns original when longer than target length', () => {
        expect(padZeroStart(12_345, 3)).toBe('12345')
    })

    it('pads zero value', () => {
        expect(padZeroStart(0, 3)).toBe('000')
    })
})
