import { describe, expect, it } from 'bun:test'
import { DEFAULT, matchWhen } from '../../../src/functions'

describe('matchWhen', () => {
    it('returns matched static value', () => {
        const result = matchWhen('apple', [
            ['apple', 'An apple'],
            ['cake', 'A cake'],
        ])

        expect(result).toBe('An apple')
    })

    it('returns DEFAULT fallback when no match', () => {
        const result = matchWhen('unknown', [
            ['apple', 'An apple'],
            [DEFAULT, 'Unknown food'],
        ])

        expect(result).toBe('Unknown food')
    })

    it('returns undefined when no match and no DEFAULT', () => {
        const result = matchWhen('unknown', [
            ['apple', 'An apple'],
        ])

        expect(result).toBeUndefined()
    })

    it('matches first matching case (first-match-wins)', () => {
        const result = matchWhen('apple', [
            ['apple', 'first'],
            ['apple', 'second'],
        ])

        expect(result).toBe('first')
    })

    it('matches multi-key conditions', () => {
        const result = matchWhen('pear', [
            [['apple', 'pear'], 'A fruit'],
            [['cake', 'pie'], 'A dessert'],
        ])

        expect(result).toBe('A fruit')
    })

    it('supports expression matching with match(true)', () => {
        const age = 15

        const result = matchWhen(true, [
            [age < 13, 'Child'],
            [age <= 19, 'Teenager'],
            [DEFAULT, 'Adult'],
        ])

        expect(result).toBe('Teenager')
    })

    it('calls function value when matched', () => {
        const result = matchWhen('apple', [
            ['apple', () => 42],
            ['bar', () => 99],
        ])

        expect(result).toBe(42)
    })

    it('calls DEFAULT function value when no match', () => {
        const result = matchWhen('unknown', [
            ['apple', 'An apple'],
            [DEFAULT, () => 'computed fallback'],
        ])

        expect(result).toBe('computed fallback')
    })

    it('handles number subjects', () => {
        const result = matchWhen(1, [
            [1, 'one'],
            [2, 'two'],
        ])

        expect(result).toBe('one')
    })

    it('handles empty cases array', () => {
        const result = matchWhen('anything', [])

        expect(result).toBeUndefined()
    })

    it('skips non-matching multi-key conditions', () => {
        const result = matchWhen('banana', [
            [['apple', 'pear'], 'A fruit'],
            [DEFAULT, 'Unknown'],
        ])

        expect(result).toBe('Unknown')
    })

    it('supports boolean expression matching with false conditions', () => {
        const age = 50

        const result = matchWhen(true, [
            [age < 13, 'Child'],
            [age <= 19, 'Teenager'],
            [age >= 40, 'Old adult'],
            [age > 19, 'Young adult'],
        ])

        expect(result).toBe('Old adult')
    })

    it('matches DEFAULT in the middle before later cases', () => {
        const result = matchWhen('cake', [
            ['apple', 'An apple'],
            [DEFAULT, 'Fallback'],
            ['cake', 'A cake'],
        ])

        expect(result).toBe('Fallback')
    })
})
