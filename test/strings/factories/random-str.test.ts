import { describe, expect, it } from 'bun:test'
import { randomStr } from '@/strings/factories'

describe('randomStr', () => {
    it('generates a string of default length 16', () => {
        expect(randomStr()).toHaveLength(16)
    })

    it('generates a string of specified length', () => {
        expect(randomStr(8)).toHaveLength(8)
        expect(randomStr(32)).toHaveLength(32)
    })

    it('generates a string of length 0', () => {
        expect(randomStr(0)).toBe('')
    })

    it('generates a string of length 1', () => {
        expect(randomStr(1)).toHaveLength(1)
    })

    it('uses default alphanumeric characters', () => {
        const result = randomStr(100)

        expect(result).toMatch(/^[A-Za-z\d]+$/u)
    })

    it('uses custom characters', () => {
        const result = randomStr(50, 'ab')

        expect(result).toMatch(/^[ab]+$/u)
    })

    it('uses single character', () => {
        expect(randomStr(5, 'x')).toBe('xxxxx')
    })

    it('generates different strings on successive calls', () => {
        const results = new Set(Array.from({ length: 10 }, () => randomStr()))

        expect(results.size).toBeGreaterThan(1)
    })
})
