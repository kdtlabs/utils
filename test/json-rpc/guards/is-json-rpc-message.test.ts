import { describe, expect, it } from 'bun:test'
import { isJsonRpcMessage } from '../../../src/json-rpc/guards'

describe('isJsonRpcMessage', () => {
    it('returns true for a valid request message', () => {
        expect(isJsonRpcMessage({ id: 1, jsonrpc: '2.0', method: 'test' })).toBe(true)
    })

    it('returns true for a valid notify message', () => {
        expect(isJsonRpcMessage({ jsonrpc: '2.0', method: 'test' })).toBe(true)
    })

    it('returns true for a valid success response', () => {
        expect(isJsonRpcMessage({ id: 1, jsonrpc: '2.0', result: 42 })).toBe(true)
    })

    it('returns true for a valid error response', () => {
        expect(isJsonRpcMessage({ error: { code: -1, message: 'fail' }, id: 1, jsonrpc: '2.0' })).toBe(true)
    })

    it('returns true for message with extra properties', () => {
        expect(isJsonRpcMessage({ extra: true, jsonrpc: '2.0', method: 'test' })).toBe(true)
    })

    it('returns false for wrong jsonrpc version', () => {
        expect(isJsonRpcMessage({ id: 1, jsonrpc: '1.0', method: 'test' })).toBe(false)
    })

    it('returns false for missing jsonrpc field', () => {
        expect(isJsonRpcMessage({ id: 1, method: 'test' })).toBe(false)
    })

    it('returns false for null', () => {
        expect(isJsonRpcMessage(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isJsonRpcMessage(undefined)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isJsonRpcMessage('hello')).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isJsonRpcMessage(42)).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isJsonRpcMessage([{ jsonrpc: '2.0' }])).toBe(false)
    })

    it('returns false for an empty object', () => {
        expect(isJsonRpcMessage({})).toBe(false)
    })
})
