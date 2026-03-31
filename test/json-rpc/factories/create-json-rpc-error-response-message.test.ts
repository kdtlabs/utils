import { describe, expect, it } from 'bun:test'
import { createJsonRpcErrorResponseMessage } from '../../../src/json-rpc/factories'

describe('createJsonRpcErrorResponseMessage', () => {
    it('creates an error response with numeric id', () => {
        const error = { code: -32_600, message: 'Invalid Request' }

        expect(createJsonRpcErrorResponseMessage(1, error)).toEqual({
            error,
            id: 1,
            jsonrpc: '2.0',
        })
    })

    it('creates an error response with string id', () => {
        const error = { code: -1, message: 'fail' }

        expect(createJsonRpcErrorResponseMessage('abc', error)).toEqual({
            error,
            id: 'abc',
            jsonrpc: '2.0',
        })
    })

    it('creates an error response with null id', () => {
        const error = { code: -32_700, message: 'Parse error' }

        expect(createJsonRpcErrorResponseMessage(null, error)).toEqual({
            error,
            id: null,
            jsonrpc: '2.0',
        })
    })

    it('creates an error response with data field', () => {
        const error = { code: -32_000, data: { stack: 'trace' }, message: 'Server error' }

        expect(createJsonRpcErrorResponseMessage(1, error)).toEqual({
            error,
            id: 1,
            jsonrpc: '2.0',
        })
    })
})
