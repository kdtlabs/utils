import { describe, expect, it } from 'bun:test'
import { computeHash } from '../../../src/system/hash'

describe('computeHash', () => {
    it('returns hex sha256 hash by default', () => {
        const result = computeHash('hello', 'sha256')

        expect(result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
    })

    it('returns base64 hash when encoding is base64', () => {
        const result = computeHash('hello', 'sha256', 'base64')

        expect(typeof result).toBe('string')
        expect(result).not.toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
    })

    it('supports md5 algorithm', () => {
        const result = computeHash('hello', 'md5')

        expect(result).toBe('5d41402abc4b2a76b9719d911017c592')
    })

    it('returns different hashes for different inputs', () => {
        const a = computeHash('hello', 'sha256')
        const b = computeHash('world', 'sha256')

        expect(a).not.toBe(b)
    })

    it('returns same hash for same input', () => {
        const a = computeHash('hello', 'sha256')
        const b = computeHash('hello', 'sha256')

        expect(a).toBe(b)
    })
})
