import type { JsonRpcMessage } from '../../../src/json-rpc/types'
import { describe, expect, it } from 'bun:test'
import { isJsonRpcResponseMessage } from '../../../src/json-rpc/guards'

describe('isJsonRpcResponseMessage', () => {
    it('returns true for a success response', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcResponseMessage(msg)).toBe(true)
    })

    it('returns true for an error response', () => {
        const msg: JsonRpcMessage = { error: { code: -1, message: 'fail' }, id: 1, jsonrpc: '2.0' }
        expect(isJsonRpcResponseMessage(msg)).toBe(true)
    })

    it('returns true for a response with null id', () => {
        const msg: JsonRpcMessage = { error: { code: -1, message: 'fail' }, id: null, jsonrpc: '2.0' }
        expect(isJsonRpcResponseMessage(msg)).toBe(true)
    })

    it('returns true for a response with string id', () => {
        const msg: JsonRpcMessage = { id: 'abc', jsonrpc: '2.0', result: true }
        expect(isJsonRpcResponseMessage(msg)).toBe(true)
    })

    it('returns false for a request message (has method)', () => {
        const msg: JsonRpcMessage = { id: 1, jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcResponseMessage(msg)).toBe(false)
    })

    it('returns false for a notify message (has method, no id)', () => {
        const msg: JsonRpcMessage = { jsonrpc: '2.0', method: 'test' }
        expect(isJsonRpcResponseMessage(msg)).toBe(false)
    })
})
