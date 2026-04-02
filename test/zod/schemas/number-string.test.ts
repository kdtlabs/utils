import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { numberString } from '../../../src/zod/schemas'

describe('numberString', () => {
    describe('valid number strings', () => {
        it('accepts integer string', () => {
            expect(z.safeParse(numberString(), '123').success).toBe(true)
        })

        it('accepts negative integer string', () => {
            expect(z.safeParse(numberString(), '-42').success).toBe(true)
        })

        it('accepts float string', () => {
            expect(z.safeParse(numberString(), '3.14').success).toBe(true)
        })

        it('accepts negative float string', () => {
            expect(z.safeParse(numberString(), '-0.5').success).toBe(true)
        })

        it('accepts scientific notation', () => {
            expect(z.safeParse(numberString(), '1e10').success).toBe(true)
        })

        it('accepts negative scientific notation', () => {
            expect(z.safeParse(numberString(), '-2.5e-3').success).toBe(true)
        })

        it('accepts Infinity', () => {
            expect(z.safeParse(numberString(), 'Infinity').success).toBe(true)
        })

        it('accepts -Infinity', () => {
            expect(z.safeParse(numberString(), '-Infinity').success).toBe(true)
        })

        it('accepts NaN', () => {
            expect(z.safeParse(numberString(), 'NaN').success).toBe(true)
        })

        it('accepts zero', () => {
            expect(z.safeParse(numberString(), '0').success).toBe(true)
        })

        it('accepts leading dot', () => {
            expect(z.safeParse(numberString(), '.5').success).toBe(true)
        })
    })

    describe('invalid number strings', () => {
        it('rejects alphabetic string', () => {
            expect(z.safeParse(numberString(), 'abc').success).toBe(false)
        })

        it('rejects empty string', () => {
            expect(z.safeParse(numberString(), '').success).toBe(false)
        })

        it('rejects string with spaces', () => {
            expect(z.safeParse(numberString(), '1 2').success).toBe(false)
        })

        it('rejects mixed alphanumeric', () => {
            expect(z.safeParse(numberString(), '12ab').success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns custom error message', () => {
            const result = z.safeParse(numberString(), 'abc')

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Invalid number string')
            }
        })
    })

    describe('pipe usage', () => {
        it('works with z.string().pipe()', () => {
            const schema = z.string().pipe(numberString())

            expect(z.safeParse(schema, '42').success).toBe(true)
            expect(z.safeParse(schema, 'abc').success).toBe(false)
        })
    })
})
