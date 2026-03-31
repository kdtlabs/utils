import { describe, expect, it } from 'bun:test'
import { isJsonRpcBatchRequest } from '../../../src/json-rpc/guards'

describe('isJsonRpcBatchRequest', () => {
    it('returns true for an array of request messages', () => {
        expect(isJsonRpcBatchRequest([
            { id: 1, jsonrpc: '2.0', method: 'foo' },
            { id: 2, jsonrpc: '2.0', method: 'bar' },
        ])).toBe(true)
    })

    it('returns true for an array of notify messages', () => {
        expect(isJsonRpcBatchRequest([
            { jsonrpc: '2.0', method: 'update' },
        ])).toBe(true)
    })

    it('returns true for mixed request and notify messages', () => {
        expect(isJsonRpcBatchRequest([
            { id: 1, jsonrpc: '2.0', method: 'foo' },
            { jsonrpc: '2.0', method: 'notify' },
        ])).toBe(true)
    })

    it('returns false for an array of response messages', () => {
        expect(isJsonRpcBatchRequest([
            { id: 1, jsonrpc: '2.0', result: 42 },
            { id: 2, jsonrpc: '2.0', result: 'ok' },
        ])).toBe(false)
    })

    it('returns false for an array of error response messages', () => {
        expect(isJsonRpcBatchRequest([
            { error: { code: -1, message: 'fail' }, id: 1, jsonrpc: '2.0' },
        ])).toBe(false)
    })

    it('returns false for an empty array', () => {
        expect(isJsonRpcBatchRequest([])).toBe(false)
    })

    it('returns false for an array with non-jsonrpc objects', () => {
        expect(isJsonRpcBatchRequest([{ foo: 'bar' }])).toBe(false)
    })

    it('returns false for an array with mixed valid and invalid items', () => {
        expect(isJsonRpcBatchRequest([
            { jsonrpc: '2.0', method: 'ok' },
            { not: 'valid' },
        ])).toBe(false)
    })

    it('returns false for null', () => {
        expect(isJsonRpcBatchRequest(null)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isJsonRpcBatchRequest('batch')).toBe(false)
    })

    it('returns false for a single message (not an array)', () => {
        expect(isJsonRpcBatchRequest({ jsonrpc: '2.0', method: 'test' })).toBe(false)
    })

    it('returns false for a batch of success responses', () => {
        expect(isJsonRpcBatchRequest([
            { id: 1, jsonrpc: '2.0', result: 42 },
            { id: 2, jsonrpc: '2.0', result: 'ok' },
        ])).toBe(false)
    })

    it('returns false for a batch of mixed success and error responses', () => {
        expect(isJsonRpcBatchRequest([
            { id: 1, jsonrpc: '2.0', result: 42 },
            { error: { code: -1, message: 'fail' }, id: 2, jsonrpc: '2.0' },
        ])).toBe(false)
    })
})
