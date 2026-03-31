import { describe, expect, it } from 'bun:test'
import { isJsonRpcError } from '@/json-rpc/guards'

describe('isJsonRpcError', () => {
    it('returns true for a valid error object', () => {
        expect(isJsonRpcError({ code: -32_600, message: 'Invalid Request' })).toBe(true)
    })

    it('returns true for an error object with data', () => {
        expect(isJsonRpcError({ code: -32_600, data: { detail: 'x' }, message: 'Invalid Request' })).toBe(true)
    })

    it('returns true for an error with extra properties', () => {
        expect(isJsonRpcError({ code: 1, extra: true, message: 'err' })).toBe(true)
    })

    it('returns false when code is missing', () => {
        expect(isJsonRpcError({ message: 'fail' })).toBe(false)
    })

    it('returns false when message is missing', () => {
        expect(isJsonRpcError({ code: -1 })).toBe(false)
    })

    it('returns false for an empty object', () => {
        expect(isJsonRpcError({})).toBe(false)
    })

    it('returns false for null', () => {
        expect(isJsonRpcError(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isJsonRpcError(undefined)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isJsonRpcError('error')).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isJsonRpcError(42)).toBe(false)
    })
})
