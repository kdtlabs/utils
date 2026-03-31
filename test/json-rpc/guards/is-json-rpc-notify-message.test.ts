import type { JsonRpcMessage } from '@/json-rpc/types'
import { describe, expect, it } from 'bun:test'
import { isJsonRpcNotifyMessage } from '@/json-rpc/guards'

describe('isJsonRpcNotifyMessage', () => {
    it('returns true for a valid notify message', () => {
        const msg: JsonRpcMessage = { jsonrpc: '2.0', method: 'update' }
        expect(isJsonRpcNotifyMessage(msg)).toBe(true)
    })

    it('returns true for a notify message with params', () => {
        const msg: JsonRpcMessage = { jsonrpc: '2.0', method: 'update', params: [1, 2, 3] }
        expect(isJsonRpcNotifyMessage(msg)).toBe(true)
    })

    it('returns false for a request message (has id)', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcNotifyMessage(msg)).toBe(false)
    })

    it('returns false for a success response', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcNotifyMessage(msg)).toBe(false)
    })

    it('returns false for an error response', () => {
        const msg: JsonRpcMessage = { error: { code: -1, message: 'fail' }, id: null, jsonrpc: '2.0' }
        expect(isJsonRpcNotifyMessage(msg)).toBe(false)
    })

    it('returns false when method is not a string', () => {
        const msg = { jsonrpc: '2.0' as const, method: 123 } as unknown as JsonRpcMessage
        expect(isJsonRpcNotifyMessage(msg)).toBe(false)
    })
})
