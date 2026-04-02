import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { validDate } from '../../../src/zod/schemas'

describe('validDate', () => {
    describe('valid dates', () => {
        it('accepts current date', () => {
            expect(z.safeParse(validDate(), new Date()).success).toBe(true)
        })

        it('accepts specific date', () => {
            expect(z.safeParse(validDate(), new Date('2024-01-15')).success).toBe(true)
        })

        it('accepts epoch date', () => {
            expect(z.safeParse(validDate(), new Date(0)).success).toBe(true)
        })
    })

    describe('invalid dates', () => {
        it('rejects invalid date from string', () => {
            expect(z.safeParse(validDate(), new Date('invalid')).success).toBe(false)
        })

        it('rejects invalid date from NaN', () => {
            expect(z.safeParse(validDate(), new Date(Number.NaN)).success).toBe(false)
        })
    })

    describe('non-date inputs', () => {
        it('rejects string', () => {
            expect(z.safeParse(validDate(), '2024-01-15').success).toBe(false)
        })

        it('rejects number', () => {
            expect(z.safeParse(validDate(), 1_234_567_890).success).toBe(false)
        })

        it('rejects null', () => {
            expect(z.safeParse(validDate(), null).success).toBe(false)
        })

        it('rejects undefined', () => {
            expect(z.safeParse(validDate(), undefined).success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns custom error message', () => {
            const result = z.safeParse(validDate(), new Date('invalid'))

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Invalid date')
            }
        })
    })

    describe('pipe usage', () => {
        it('works with transform pipeline', () => {
            const schema = z.unknown().transform((val) => new Date(val as string)).pipe(validDate())

            expect(z.safeParse(schema, '2024-01-15').success).toBe(true)
            expect(z.safeParse(schema, 'garbage').success).toBe(false)
        })
    })
})
