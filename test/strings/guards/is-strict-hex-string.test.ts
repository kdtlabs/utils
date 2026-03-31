import { describe, expect, it } from 'bun:test'
import { isStrictHexString } from '@/strings/guards'

describe('isStrictHexString', () => {
    it('returns true for valid hex with 0x prefix', () => {
        expect(isStrictHexString('0xdeadbeef')).toBe(true)
    })

    it('returns false for hex without 0x prefix', () => {
        expect(isStrictHexString('deadbeef')).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(isStrictHexString('')).toBe(false)
    })

    it('returns false for only 0x prefix', () => {
        expect(isStrictHexString('0x')).toBe(false)
    })

    it('validates length in bytes', () => {
        expect(isStrictHexString('0xaabb', 2)).toBe(true)
        expect(isStrictHexString('0xaabb', 3)).toBe(false)
    })

    it('narrows type to HexString', () => {
        const value = '0xabc'

        if (isStrictHexString(value)) {
            const hex: `0x${string}` = value

            expect(hex).toBe('0xabc')
        }
    })
})
