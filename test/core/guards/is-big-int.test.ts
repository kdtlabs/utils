import { describe, expect, it } from 'bun:test'
import { isBigInt } from '../../../src/core/guards'

describe('isBigInt', () => {
    it('returns true for a bigint', () => {
        expect(isBigInt(1n)).toBe(true)
    })

    it('returns true for 0n', () => {
        expect(isBigInt(0n)).toBe(true)
    })

    it('returns false for a number', () => {
        expect(isBigInt(1)).toBe(false)
    })
})
