import type { JsonRpcMessage } from '@/json-rpc/types'
import { describe, expect, it } from 'bun:test'
import { isJsonRpcSuccessResponseMessage } from '@/json-rpc/guards'

describe('isJsonRpcSuccessResponseMessage', () => {
    it('returns true for a success response', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcSuccessResponseMessage(msg)).toBe(true)
    })

    it('returns true for a success response with null result', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', result: null }
        expect(isJsonRpcSuccessResponseMessage(msg)).toBe(true)
    })

    it('returns true for a success response with string id', () => {
        const msg: JsonRpcMessage = { id: 'abc', jsonrpc: '2.0', result: { data: true } }
        expect(isJsonRpcSuccessResponseMessage(msg)).toBe(true)
    })

    it('returns false for an error response', () => {
        const msg: JsonRpcMessage = { error: { code: -1, message: 'fail' }, id: 1, jsonrpc: '2.0' }
        expect(isJsonRpcSuccessResponseMessage(msg)).toBe(false)
    })

    it('returns false for a request message', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcSuccessResponseMessage(msg)).toBe(false)
    })

    it('returns false for a notify message', () => {
        const msg: JsonRpcMessage = { jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcSuccessResponseMessage(msg)).toBe(false)
    })

    it('returns false when both result and error are present', () => {
        const msg = { error: { code: -1, message: 'fail' }, id: 1, jsonrpc: '2.0' as const, result: 42 } as unknown as JsonRpcMessage
        expect(isJsonRpcSuccessResponseMessage(msg)).toBe(false)
    })
})
