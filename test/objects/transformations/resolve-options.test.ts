import { describe, expect, it } from 'bun:test'
import { resolveOptions } from '@/objects/transformations'

describe('resolveOptions', () => {
    const defaultValue = { color: 'red', indent: 4 }

    it('returns default value when options is undefined', () => {
        expect(resolveOptions(undefined, defaultValue)).toEqual(defaultValue)
    })

    it('returns default value when options is null', () => {
        expect(resolveOptions(null, defaultValue)).toEqual(defaultValue)
    })

    it('returns default value when options is true', () => {
        expect(resolveOptions(true, defaultValue)).toEqual(defaultValue)
    })

    it('returns false when options is false', () => {
        expect(resolveOptions(false, defaultValue)).toBe(false)
    })

    it('returns the options object when options is a valid object', () => {
        const custom = { color: 'blue', indent: 2 }
        expect(resolveOptions(custom, defaultValue)).toEqual(custom)
    })

    it('returns the options object by reference, not a copy', () => {
        const custom = { color: 'blue', indent: 2 }
        expect(resolveOptions(custom, defaultValue)).toBe(custom)
    })

    it('does not merge options with default value', () => {
        const partial = { color: 'blue' }
        const result = resolveOptions(partial, defaultValue)

        expect(result).toBe(partial)
        expect(result).toEqual({ color: 'blue' })
        expect(result).not.toHaveProperty('indent')
    })

    it('returns false when options is false and default is also false', () => {
        expect(resolveOptions(false, false)).toBe(false)
    })

    it('returns false when options is undefined and default is false', () => {
        expect(resolveOptions(undefined, false)).toBe(false)
    })

    it('returns false when options is null and default is false', () => {
        expect(resolveOptions(null, false)).toBe(false)
    })

    it('returns false when options is true and default is false', () => {
        expect(resolveOptions(true, false)).toBe(false)
    })

    it('returns options when options is an empty object', () => {
        const empty = {}
        expect(resolveOptions(empty, defaultValue)).toBe(empty)
    })

    it('returns options when options is a nested object', () => {
        const nested = { theme: { dark: true, fontSize: 14 } }
        const result = resolveOptions(nested, { theme: { dark: false, fontSize: 12 } })

        expect(result).toBe(nested)
    })
})
