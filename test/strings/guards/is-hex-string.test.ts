import { describe, expect, it } from 'bun:test'
import { isHexString } from '../../../src/strings/guards'

describe('isHexString', () => {
    it('returns true for lowercase hex without prefix', () => {
        expect(isHexString('deadbeef')).toBe(true)
    })

    it('returns true for uppercase hex without prefix', () => {
        expect(isHexString('DEADBEEF')).toBe(true)
    })

    it('returns true for mixed case hex without prefix', () => {
        expect(isHexString('DeAdBeEf')).toBe(true)
    })

    it('returns true for hex with 0x prefix', () => {
        expect(isHexString('0xdeadbeef')).toBe(true)
    })

    it('returns true for hex with 0X prefix', () => {
        expect(isHexString('0Xdeadbeef')).toBe(true)
    })

    it('returns false for non-hex characters', () => {
        expect(isHexString('xyz123')).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(isHexString('')).toBe(false)
    })

    it('returns false for only 0x prefix', () => {
        expect(isHexString('0x')).toBe(false)
    })

    it('validates length in bytes', () => {
        expect(isHexString('aabb', 2)).toBe(true)
        expect(isHexString('aabb', 3)).toBe(false)
        expect(isHexString('aabbcc', 3)).toBe(true)
    })

    it('validates length with 0x prefix', () => {
        expect(isHexString('0xaabb', 2)).toBe(true)
        expect(isHexString('0xaabb', 3)).toBe(false)
    })

    it('returns true for single hex digit without length', () => {
        expect(isHexString('f')).toBe(true)
    })
})
