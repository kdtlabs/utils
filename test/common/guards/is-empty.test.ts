import { describe, expect, it } from 'bun:test'
import { isEmpty } from '../../../src/common/guards'

describe('isEmpty', () => {
    it('returns true for null', () => {
        expect(isEmpty(null)).toBe(true)
    })

    it('returns true for undefined', () => {
        expect(isEmpty(undefined)).toBe(true)
    })

    it('returns true for empty string', () => {
        expect(isEmpty('')).toBe(true)
    })

    it('returns false for non-empty string', () => {
        expect(isEmpty('hello')).toBe(false)
    })

    it('returns true for empty array', () => {
        expect(isEmpty([])).toBe(true)
    })

    it('returns false for non-empty array', () => {
        expect(isEmpty([1])).toBe(false)
    })

    it('returns true for empty object', () => {
        expect(isEmpty({})).toBe(true)
    })

    it('returns false for non-empty object', () => {
        expect(isEmpty({ a: 1 })).toBe(false)
    })

    it('returns true for empty Map', () => {
        expect(isEmpty(new Map())).toBe(true)
    })

    it('returns false for non-empty Map', () => {
        expect(isEmpty(new Map([['a', 1]]))).toBe(false)
    })

    it('returns true for empty Set', () => {
        expect(isEmpty(new Set())).toBe(true)
    })

    it('returns false for non-empty Set', () => {
        expect(isEmpty(new Set([1]))).toBe(false)
    })

    it('returns false for number primitives', () => {
        expect(isEmpty(0)).toBe(false)
        expect(isEmpty(42)).toBe(false)
    })

    it('returns false for boolean primitives', () => {
        expect(isEmpty(false)).toBe(false)
        expect(isEmpty(true)).toBe(false)
    })

    it('returns false for bigint primitives', () => {
        expect(isEmpty(0n)).toBe(false)
    })

    it('returns false for symbol primitives', () => {
        expect(isEmpty(Symbol('test'))).toBe(false)
    })

    it('returns false for non-plain objects', () => {
        expect(isEmpty(new Date())).toBe(false)
        expect(isEmpty(/regex/u)).toBe(false)
    })
})
