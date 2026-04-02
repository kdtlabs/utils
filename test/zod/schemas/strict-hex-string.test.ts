import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { strictHexString } from '../../../src/zod/schemas'

describe('strictHexString', () => {
    describe('without length', () => {
        it('accepts hex with 0x prefix', () => {
            expect(z.safeParse(strictHexString(), '0xdeadbeef').success).toBe(true)
        })

        it('accepts single digit with 0x prefix', () => {
            expect(z.safeParse(strictHexString(), '0xf').success).toBe(true)
        })

        it('rejects hex without 0x prefix', () => {
            expect(z.safeParse(strictHexString(), 'deadbeef').success).toBe(false)
        })

        it('rejects empty string', () => {
            expect(z.safeParse(strictHexString(), '').success).toBe(false)
        })

        it('rejects only 0x prefix', () => {
            expect(z.safeParse(strictHexString(), '0x').success).toBe(false)
        })

        it('rejects non-hex characters with 0x prefix', () => {
            expect(z.safeParse(strictHexString(), '0xxyz').success).toBe(false)
        })
    })

    describe('with length', () => {
        it('accepts hex with 0x prefix matching byte length', () => {
            expect(z.safeParse(strictHexString(2), '0xaabb').success).toBe(true)
        })

        it('rejects hex with 0x prefix not matching byte length', () => {
            expect(z.safeParse(strictHexString(3), '0xaabb').success).toBe(false)
        })

        it('rejects hex without 0x prefix even if length matches', () => {
            expect(z.safeParse(strictHexString(2), 'aabb').success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns generic message without length', () => {
            const result = z.safeParse(strictHexString(), 'deadbeef')

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Invalid strict hex string (expected 0x prefix)')
            }
        })

        it('returns length-specific message with length', () => {
            const result = z.safeParse(strictHexString(32), '0xaabb')

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Invalid strict hex string (expected 0x prefix, 32 bytes)')
            }
        })
    })

    describe('pipe usage', () => {
        it('works with z.string().pipe()', () => {
            const schema = z.string().pipe(strictHexString())

            expect(z.safeParse(schema, '0xabcd').success).toBe(true)
            expect(z.safeParse(schema, 'abcd').success).toBe(false)
        })
    })
})
