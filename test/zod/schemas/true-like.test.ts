import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { trueLike } from '../../../src/zod/schemas'

describe('trueLike', () => {
    describe('default options', () => {
        it('transforms boolean true to true', () => {
            expect(z.parse(trueLike(), true)).toBe(true)
        })

        it('transforms boolean false to false', () => {
            expect(z.parse(trueLike(), false)).toBe(false)
        })

        it('transforms string "true" to true', () => {
            expect(z.parse(trueLike(), 'true')).toBe(true)
        })

        it('transforms string "yes" to true', () => {
            expect(z.parse(trueLike(), 'yes')).toBe(true)
        })

        it('transforms string "1" to true', () => {
            expect(z.parse(trueLike(), '1')).toBe(true)
        })

        it('transforms string "false" to false', () => {
            expect(z.parse(trueLike(), 'false')).toBe(false)
        })

        it('transforms string "no" to false', () => {
            expect(z.parse(trueLike(), 'no')).toBe(false)
        })

        it('transforms number 1 to true', () => {
            expect(z.parse(trueLike(), 1)).toBe(true)
        })

        it('transforms number 0 to false', () => {
            expect(z.parse(trueLike(), 0)).toBe(false)
        })

        it('transforms number 2 to false by default', () => {
            expect(z.parse(trueLike(), 2)).toBe(false)
        })

        it('transforms bigint 1n to true', () => {
            expect(z.parse(trueLike(), 1n)).toBe(true)
        })

        it('transforms bigint 0n to false', () => {
            expect(z.parse(trueLike(), 0n)).toBe(false)
        })

        it('transforms null to false', () => {
            expect(z.parse(trueLike(), null)).toBe(false)
        })

        it('transforms undefined to false', () => {
            expect(z.parse(trueLike(), undefined)).toBe(false)
        })

        it('transforms object to false', () => {
            expect(z.parse(trueLike(), {})).toBe(false)
        })
    })

    describe('anyNonZeroNumber option', () => {
        it('transforms number 42 to true when enabled', () => {
            expect(z.parse(trueLike({ anyNonZeroNumber: true }), 42)).toBe(true)
        })

        it('transforms number -1 to true when enabled', () => {
            expect(z.parse(trueLike({ anyNonZeroNumber: true }), -1)).toBe(true)
        })

        it('transforms number 0 to false when enabled', () => {
            expect(z.parse(trueLike({ anyNonZeroNumber: true }), 0)).toBe(false)
        })

        it('transforms bigint 99n to true when enabled', () => {
            expect(z.parse(trueLike({ anyNonZeroNumber: true }), 99n)).toBe(true)
        })
    })

    describe('custom trueStrings option', () => {
        it('uses custom true strings', () => {
            const schema = trueLike({ trueStrings: new Set(['enabled', 'on']) })

            expect(z.parse(schema, 'on')).toBe(true)
            expect(z.parse(schema, 'enabled')).toBe(true)
            expect(z.parse(schema, 'true')).toBe(false)
        })
    })

    describe('pipe usage', () => {
        it('works with z.unknown().pipe()', () => {
            const schema = z.unknown().pipe(trueLike())

            expect(z.parse(schema, 'true')).toBe(true)
            expect(z.parse(schema, 'false')).toBe(false)
        })
    })
})
