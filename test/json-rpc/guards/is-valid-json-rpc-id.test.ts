import { describe, expect, it } from 'bun:test'
import { isValidJsonRpcId } from '@/json-rpc/guards'

describe('isValidJsonRpcId', () => {
    it('returns true for a string', () => {
        expect(isValidJsonRpcId('abc')).toBe(true)
    })

    it('returns true for an empty string', () => {
        expect(isValidJsonRpcId('')).toBe(true)
    })

    it('returns true for a number', () => {
        expect(isValidJsonRpcId(42)).toBe(true)
    })

    it('returns true for zero', () => {
        expect(isValidJsonRpcId(0)).toBe(true)
    })

    it('returns true for a negative number', () => {
        expect(isValidJsonRpcId(-1)).toBe(true)
    })

    it('returns true for null', () => {
        expect(isValidJsonRpcId(null)).toBe(true)
    })

    it('returns false for undefined', () => {
        expect(isValidJsonRpcId(undefined)).toBe(false)
    })

    it('returns false for a boolean', () => {
        expect(isValidJsonRpcId(true)).toBe(false)
    })

    it('returns false for an object', () => {
        expect(isValidJsonRpcId({})).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isValidJsonRpcId([])).toBe(false)
    })

    it('returns false for a symbol', () => {
        expect(isValidJsonRpcId(Symbol('id'))).toBe(false)
    })

    it('returns true for NaN (isNumber includes NaN)', () => {
        expect(isValidJsonRpcId(Number.NaN)).toBe(true)
    })

    it('returns true for Infinity', () => {
        expect(isValidJsonRpcId(Infinity)).toBe(true)
    })

    it('returns true for float numbers', () => {
        expect(isValidJsonRpcId(1.5)).toBe(true)
    })
})
