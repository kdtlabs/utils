import { describe, expect, it } from 'bun:test'
import { isString } from '../../../src/core/guards'

describe('isString', () => {
    it('returns true for a string', () => {
        expect(isString('hello')).toBe(true)
    })

    it('returns true for empty string', () => {
        expect(isString('')).toBe(true)
    })

    it('returns false for a number', () => {
        expect(isString(42)).toBe(false)
    })

    it('returns false for a String object', () => {
        // eslint-disable-next-line no-new-wrappers
        expect(isString(new String('hello'))).toBe(false)
    })
})
