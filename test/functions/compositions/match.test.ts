import { describe, expect, it } from 'bun:test'
import { DEFAULT, match } from '../../../src/functions'

describe('match', () => {
    it('returns matched static value', () => {
        const result = match('apple', {
            apple: 'This is an apple',
            bar: 'This is a bar',
        })

        expect(result).toBe('This is an apple')
    })

    it('returns DEFAULT fallback when no match', () => {
        const result = match('unknown', {
            apple: 'apple',
            [DEFAULT]: 'fallback',
        })

        expect(result).toBe('fallback')
    })

    it('returns undefined when no match and no DEFAULT', () => {
        const result = match('unknown', {
            apple: 'apple',
        })

        expect(result).toBeUndefined()
    })

    it('calls function value when matched', () => {
        const result = match('apple', {
            apple: () => 42,
            bar: () => 99,
        })

        expect(result).toBe(42)
    })

    it('calls DEFAULT function value when no match', () => {
        const result = match('unknown', {
            apple: 'apple',
            [DEFAULT]: () => 'computed fallback',
        })

        expect(result).toBe('computed fallback')
    })

    it('matches number keys', () => {
        const result = match(1, {
            1: 'one',
            2: 'two',
        })

        expect(result).toBe('one')
    })

    it('handles empty cases object', () => {
        const result = match('anything', {})

        expect(result).toBeUndefined()
    })

    it('prefers exact match over DEFAULT', () => {
        const result = match('apple', {
            apple: 'exact',
            [DEFAULT]: 'fallback',
        })

        expect(result).toBe('exact')
    })

    it('matches symbol keys', () => {
        const key = Symbol('myKey')

        const result = match(key, {
            [key]: 'symbol value',
        })

        expect(result).toBe('symbol value')
    })

    it('returns explicit undefined value without falling through to DEFAULT', () => {
        const result = match('a', {
            a: undefined,
            [DEFAULT]: 'fallback',
        })

        expect(result).toBeUndefined()
    })

    it('returns falsy values correctly', () => {
        expect(match('a', { a: null })).toBeNull()
        expect(match('a', { a: 0 })).toBe(0)
        expect(match('a', { a: false })).toBe(false)
        expect(match('a', { a: '' })).toBe('')
    })
})
