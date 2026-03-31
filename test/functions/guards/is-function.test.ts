import { describe, expect, it } from 'bun:test'
import { isFunction } from '@/functions/guards'

describe('isFunction', () => {
    it('returns true for arrow function', () => {
        expect(isFunction(() => {})).toBe(true)
    })

    it('returns true for function declaration', () => {
        expect(isFunction(() => {})).toBe(true)
    })

    it('returns true for class constructor', () => {
        expect(isFunction(class {})).toBe(true)
    })

    it('returns false for null', () => {
        expect(isFunction(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isFunction(undefined)).toBe(false)
    })

    it('returns false for object', () => {
        expect(isFunction({})).toBe(false)
    })

    it('returns false for string', () => {
        expect(isFunction('fn')).toBe(false)
    })

    it('returns false for number', () => {
        expect(isFunction(42)).toBe(false)
    })
})
