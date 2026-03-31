import { describe, expect, it } from 'bun:test'
import { notNull } from '@/core/guards'

describe('notNull', () => {
    it('returns false for null', () => {
        expect(notNull(null)).toBe(false)
    })

    it('returns true for undefined', () => {
        expect(notNull(undefined)).toBe(true)
    })

    it('returns true for 0', () => {
        expect(notNull(0)).toBe(true)
    })

    it('returns true for a string', () => {
        expect(notNull('hello')).toBe(true)
    })
})
