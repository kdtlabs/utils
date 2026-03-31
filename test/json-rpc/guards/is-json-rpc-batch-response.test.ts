import { describe, expect, it } from 'bun:test'
import { isJsonRpcBatchResponse } from '../../../src/json-rpc/guards'

describe('isJsonRpcBatchResponse', () => {
    it('returns true for an array of success responses', () => {
        expect(isJsonRpcBatchResponse([
            { id: 1, jsonrpc: '2.0', result: 42 },
            { id: 2, jsonrpc: '2.0', result: 'ok' },
        ])).toBe(true)
    })

    it('returns true for an array of error responses', () => {
        expect(isJsonRpcBatchResponse([
            { error: { code: -1, message: 'fail' }, id: 1, jsonrpc: '2.0' },
        ])).toBe(true)
    })

    it('returns true for mixed success and error responses', () => {
        expect(isJsonRpcBatchResponse([
            { id: 1, jsonrpc: '2.0', result: 42 },
            { error: { code: -1, message: 'fail' }, id: 2, jsonrpc: '2.0' },
        ])).toBe(true)
    })

    it('returns false for an array of request messages', () => {
        expect(isJsonRpcBatchResponse([
            { id: 1, jsonrpc: '2.0', method: 'foo' },
            { id: 2, jsonrpc: '2.0', method: 'bar' },
        ])).toBe(false)
    })

    it('returns false for an array of notify messages', () => {
        expect(isJsonRpcBatchResponse([
            { jsonrpc: '2.0', method: 'update' },
        ])).toBe(false)
    })

    it('returns false for mixed request and response messages', () => {
        expect(isJsonRpcBatchResponse([
            { id: 1, jsonrpc: '2.0', result: 42 },
            { id: 2, jsonrpc: '2.0', method: 'foo' },
        ])).toBe(false)
    })

    it('returns false for an empty array', () => {
        expect(isJsonRpcBatchResponse([])).toBe(false)
    })

    it('returns false for an array with non-jsonrpc objects', () => {
        expect(isJsonRpcBatchResponse([{ foo: 'bar' }])).toBe(false)
    })

    it('returns false for an array with mixed valid and invalid items', () => {
        expect(isJsonRpcBatchResponse([
            { id: 1, jsonrpc: '2.0', result: 42 },
            { invalid: true },
        ])).toBe(false)
    })

    it('returns false for null', () => {
        expect(isJsonRpcBatchResponse(null)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isJsonRpcBatchResponse('batch')).toBe(false)
    })

    it('returns false for a single response (not an array)', () => {
        expect(isJsonRpcBatchResponse({ id: 1, jsonrpc: '2.0', result: 42 })).toBe(false)
    })

    it('returns false for a batch of request and notify messages', () => {
        expect(isJsonRpcBatchResponse([
            { id: 1, jsonrpc: '2.0', method: 'foo' },
            { jsonrpc: '2.0', method: 'notify' },
        ])).toBe(false)
    })
})
