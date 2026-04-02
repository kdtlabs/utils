import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { hexString } from '../../../src/zod/schemas'

describe('hexString', () => {
    describe('without length', () => {
        it('accepts lowercase hex', () => {
            expect(z.safeParse(hexString(), 'deadbeef').success).toBe(true)
        })

        it('accepts uppercase hex', () => {
            expect(z.safeParse(hexString(), 'DEADBEEF').success).toBe(true)
        })

        it('accepts mixed case hex', () => {
            expect(z.safeParse(hexString(), 'DeAdBeEf').success).toBe(true)
        })

        it('accepts hex with 0x prefix', () => {
            expect(z.safeParse(hexString(), '0xdeadbeef').success).toBe(true)
        })

        it('accepts single hex digit', () => {
            expect(z.safeParse(hexString(), 'f').success).toBe(true)
        })

        it('rejects non-hex characters', () => {
            expect(z.safeParse(hexString(), 'xyz123').success).toBe(false)
        })

        it('rejects empty string', () => {
            expect(z.safeParse(hexString(), '').success).toBe(false)
        })

        it('rejects only 0x prefix', () => {
            expect(z.safeParse(hexString(), '0x').success).toBe(false)
        })
    })

    describe('with length', () => {
        it('accepts hex matching byte length', () => {
            expect(z.safeParse(hexString(2), 'aabb').success).toBe(true)
        })

        it('rejects hex not matching byte length', () => {
            expect(z.safeParse(hexString(3), 'aabb').success).toBe(false)
        })

        it('accepts hex with 0x prefix matching byte length', () => {
            expect(z.safeParse(hexString(2), '0xaabb').success).toBe(true)
        })

        it('rejects hex with 0x prefix not matching byte length', () => {
            expect(z.safeParse(hexString(3), '0xaabb').success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns generic message without length', () => {
            const result = z.safeParse(hexString(), 'xyz')

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Invalid hex string')
            }
        })

        it('returns length-specific message with length', () => {
            const result = z.safeParse(hexString(32), 'aabb')

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Invalid hex string (expected 32 bytes)')
            }
        })
    })

    describe('pipe usage', () => {
        it('works with z.string().pipe()', () => {
            const schema = z.string().min(1).pipe(hexString())

            expect(z.safeParse(schema, 'abcd').success).toBe(true)
            expect(z.safeParse(schema, 'xyz').success).toBe(false)
        })
    })
})
