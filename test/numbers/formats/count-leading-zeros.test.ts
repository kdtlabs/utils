import { describe, expect, it } from 'bun:test'
import { countLeadingZeros } from '@/numbers/formats'

describe('countLeadingZeros', () => {
    it('counts leading zeros', () => {
        expect(countLeadingZeros('00123')).toBe(2)
    })

    it('returns 0 when no leading zeros', () => {
        expect(countLeadingZeros('123')).toBe(0)
    })

    it('counts all zeros', () => {
        expect(countLeadingZeros('0000')).toBe(4)
    })

    it('returns 0 for an empty string', () => {
        expect(countLeadingZeros('')).toBe(0)
    })

    it('returns 1 for a single zero', () => {
        expect(countLeadingZeros('0')).toBe(1)
    })
})
