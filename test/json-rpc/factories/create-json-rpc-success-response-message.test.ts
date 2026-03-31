import { describe, expect, it } from 'bun:test'
import { createJsonRpcSuccessResponseMessage } from '../../../src/json-rpc/factories'

describe('createJsonRpcSuccessResponseMessage', () => {
    it('creates a success response with numeric id', () => {
        expect(createJsonRpcSuccessResponseMessage(1, 42)).toEqual({
            id: 1,
            jsonrpc: '2.0',
            result: 42,
        })
    })

    it('creates a success response with string id', () => {
        expect(createJsonRpcSuccessResponseMessage('abc', 'done')).toEqual({
            id: 'abc',
            jsonrpc: '2.0',
            result: 'done',
        })
    })

    it('creates a success response with null id', () => {
        expect(createJsonRpcSuccessResponseMessage(null, true)).toEqual({
            id: null,
            jsonrpc: '2.0',
            result: true,
        })
    })

    it('creates a success response with null result', () => {
        expect(createJsonRpcSuccessResponseMessage(1, null)).toEqual({
            id: 1,
            jsonrpc: '2.0',
            result: null,
        })
    })

    it('creates a success response with object result', () => {
        const result = { data: [1, 2, 3] }

        expect(createJsonRpcSuccessResponseMessage(1, result)).toEqual({
            id: 1,
            jsonrpc: '2.0',
            result,
        })
    })
})
