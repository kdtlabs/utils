import type { JsonRpcMessage } from '@/json-rpc/types'
import { describe, expect, it } from 'bun:test'
import { isJsonRpcErrorResponseMessage } from '@/json-rpc/guards'

describe('isJsonRpcErrorResponseMessage', () => {
    it('returns true for a valid error response', () => {
        const msg: JsonRpcMessage = { error: { code: -32_600, message: 'Invalid Request' }, id: 1, jsonrpc: '2.0' }
        expect(isJsonRpcErrorResponseMessage(msg)).toBe(true)
    })

    it('returns true for an error response with data', () => {
        const msg: JsonRpcMessage = { error: { code: -1, data: 'detail', message: 'fail' }, id: 1, jsonrpc: '2.0' }
        expect(isJsonRpcErrorResponseMessage(msg)).toBe(true)
    })

    it('returns false for a success response', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcErrorResponseMessage(msg)).toBe(false)
    })

    it('returns false for a request message', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcErrorResponseMessage(msg)).toBe(false)
    })

    it('returns false for a notify message', () => {
        const msg: JsonRpcMessage = { jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcErrorResponseMessage(msg)).toBe(false)
    })

    it('returns false when error is not a valid error object', () => {
        const msg = { error: 'not an object', id: 1, jsonrpc: '2.0' as const } as unknown as JsonRpcMessage
        expect(isJsonRpcErrorResponseMessage(msg)).toBe(false)
    })

    it('returns false when error is missing code', () => {
        const msg = { error: { message: 'fail' }, id: 1, jsonrpc: '2.0' as const } as unknown as JsonRpcMessage
        expect(isJsonRpcErrorResponseMessage(msg)).toBe(false)
    })
})
