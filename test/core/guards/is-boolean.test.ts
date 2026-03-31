import { describe, expect, it } from 'bun:test'
import { isBoolean } from '../../../src/core/guards'

describe('isBoolean', () => {
    it('returns true for true', () => {
        expect(isBoolean(true)).toBe(true)
    })

    it('returns true for false', () => {
        expect(isBoolean(false)).toBe(true)
    })

    it('returns false for 0', () => {
        expect(isBoolean(0)).toBe(false)
    })

    it('returns false for "true" string', () => {
        expect(isBoolean('true')).toBe(false)
    })
})
