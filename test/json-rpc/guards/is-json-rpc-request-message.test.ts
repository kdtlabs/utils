import type { JsonRpcMessage } from '@/json-rpc/types'
import { describe, expect, it } from 'bun:test'
import { isJsonRpcRequestMessage } from '@/json-rpc/guards'

describe('isJsonRpcRequestMessage', () => {
    it('returns true for a valid request with string id', () => {
        const msg: JsonRpcMessage = { id: 'abc', jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcRequestMessage(msg)).toBe(true)
    })

    it('returns true for a valid request with numeric id', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcRequestMessage(msg)).toBe(true)
    })

    it('returns true for a request with params', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', method: 'test', params: { a: 1 } }
        expect(isJsonRpcRequestMessage(msg)).toBe(true)
    })

    it('returns false for a notify message (no id)', () => {
        const msg: JsonRpcMessage = { jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcRequestMessage(msg)).toBe(false)
    })

    it('returns false for a success response (no method)', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcRequestMessage(msg)).toBe(false)
    })

    it('returns false for an error response (no method)', () => {
        const msg: JsonRpcMessage = { error: { code: -1, message: 'fail' }, id: 1, jsonrpc: '2.0' }
        expect(isJsonRpcRequestMessage(msg)).toBe(false)
    })

    it('returns true when id is null (null is a valid JSON-RPC id)', () => {
        const msg = { id: null, jsonrpc: '2.0' as const, method: 'test' }
        expect(isJsonRpcRequestMessage(msg)).toBe(true)
    })

    it('returns false when method is not a string', () => {
        const msg = { id: 1, jsonrpc: '2.0' as const, method: 123 } as unknown as JsonRpcMessage
        expect(isJsonRpcRequestMessage(msg)).toBe(false)
    })
})
