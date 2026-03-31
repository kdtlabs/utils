import { describe, expect, it } from 'bun:test'
import { notUndefined } from '@/core/guards'

describe('notUndefined', () => {
    it('returns false for undefined', () => {
        expect(notUndefined(undefined)).toBe(false)
    })

    it('returns true for null', () => {
        expect(notUndefined(null)).toBe(true)
    })

    it('returns true for 0', () => {
        expect(notUndefined(0)).toBe(true)
    })

    it('returns true for a string', () => {
        expect(notUndefined('hello')).toBe(true)
    })
})
