import type { JsonRpcResponseMessage } from '@/json-rpc/types'
import { describe, expect, it } from 'bun:test'
import { isJsonRpcResponseHasNonNullableId } from '@/json-rpc/guards'

describe('isJsonRpcResponseHasNonNullableId', () => {
    it('returns true for a response with numeric id', () => {
        const msg: JsonRpcResponseMessage = { id: 1, jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcResponseHasNonNullableId(msg)).toBe(true)
    })

    it('returns true for a response with string id', () => {
        const msg: JsonRpcResponseMessage = { id: 'abc', jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcResponseHasNonNullableId(msg)).toBe(true)
    })

    it('returns true for an error response with numeric id', () => {
        const msg: JsonRpcResponseMessage = { error: { code: -1, message: 'fail' }, id: 1, jsonrpc: '2.0' }
        expect(isJsonRpcResponseHasNonNullableId(msg)).toBe(true)
    })

    it('returns false for a response with null id', () => {
        const msg: JsonRpcResponseMessage = { id: null, jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcResponseHasNonNullableId(msg)).toBe(false)
    })

    it('returns false for an error response with null id', () => {
        const msg: JsonRpcResponseMessage = { error: { code: -1, message: 'fail' }, id: null, jsonrpc: '2.0' }
        expect(isJsonRpcResponseHasNonNullableId(msg)).toBe(false)
    })

    it('returns true for a response with zero id', () => {
        const msg: JsonRpcResponseMessage = { id: 0, jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcResponseHasNonNullableId(msg)).toBe(true)
    })

    it('returns true for a response with empty string id', () => {
        const msg: JsonRpcResponseMessage = { id: '', jsonrpc: '2.0', result: 42 }
        expect(isJsonRpcResponseHasNonNullableId(msg)).toBe(true)
    })
})
