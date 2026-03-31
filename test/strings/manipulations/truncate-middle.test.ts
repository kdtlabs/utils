import { describe, expect, it } from 'bun:test'
import { truncateMiddle } from '../../../src/strings/manipulations'

describe('truncateMiddle', () => {
    it('returns the original string when shorter than maxLength', () => {
        expect(truncateMiddle('hello', 10)).toBe('hello')
    })

    it('returns the original string when exactly maxLength', () => {
        expect(truncateMiddle('hello', 5)).toBe('hello')
    })

    it('truncates in the middle with default omission', () => {
        expect(truncateMiddle('hello world', 8)).toBe('he...rld')
    })

    it('truncates with custom omission', () => {
        expect(truncateMiddle('hello world', 8, '…')).toBe('hel…orld')
    })

    it('gives extra char to tail when available is odd', () => {
        expect(truncateMiddle('abcdefghij', 6)).toBe('a...ij')
    })

    it('handles maxLength equal to omission length', () => {
        expect(truncateMiddle('hello world', 3)).toBe('...')
    })

    it('handles maxLength less than omission length', () => {
        expect(truncateMiddle('hello world', 2)).toBe('..')
    })

    it('handles empty string', () => {
        expect(truncateMiddle('', 5)).toBe('')
    })

    it('handles empty omission', () => {
        expect(truncateMiddle('hello world', 5, '')).toBe('herld')
    })
})
