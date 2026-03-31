import { describe, expect, it } from 'bun:test'
import { truncate } from '../../../src/strings/manipulations'

describe('truncate', () => {
    it('returns the original string when shorter than maxLength', () => {
        expect(truncate('hello', 10)).toBe('hello')
    })

    it('returns the original string when exactly maxLength', () => {
        expect(truncate('hello', 5)).toBe('hello')
    })

    it('truncates and appends default omission', () => {
        expect(truncate('hello world', 8)).toBe('hello...')
    })

    it('truncates with custom omission', () => {
        expect(truncate('hello world', 8, '…')).toBe('hello w…')
    })

    it('truncates with single char omission', () => {
        expect(truncate('hello world', 6, '.')).toBe('hello.')
    })

    it('handles maxLength equal to omission length', () => {
        expect(truncate('hello world', 3)).toBe('...')
    })

    it('handles maxLength less than omission length', () => {
        expect(truncate('hello world', 2)).toBe('..')
    })

    it('handles empty string', () => {
        expect(truncate('', 5)).toBe('')
    })

    it('handles empty omission', () => {
        expect(truncate('hello world', 5, '')).toBe('hello')
    })
})
