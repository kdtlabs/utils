import { describe, expect, it } from 'bun:test'
import { createJsonRpcRequestMessage } from '@/json-rpc/factories'

describe('createJsonRpcRequestMessage', () => {
    it('creates a request message with numeric id and no params', () => {
        expect(createJsonRpcRequestMessage(1, 'test')).toEqual({
            id: 1,
            jsonrpc: '2.0',
            method: 'test',
        })
    })

    it('creates a request message with string id', () => {
        expect(createJsonRpcRequestMessage('abc', 'test')).toEqual({
            id: 'abc',
            jsonrpc: '2.0',
            method: 'test',
        })
    })

    it('creates a request message with params', () => {
        expect(createJsonRpcRequestMessage(1, 'add', { a: 1, b: 2 })).toEqual({
            id: 1,
            jsonrpc: '2.0',
            method: 'add',
            params: { a: 1, b: 2 },
        })
    })

    it('does not include params when undefined', () => {
        const msg = createJsonRpcRequestMessage(1, 'test')
        expect('params' in msg).toBe(false)
    })

    it('includes params when null', () => {
        const msg = createJsonRpcRequestMessage(1, 'test', null)
        expect(msg.params).toBeNull()
    })

    it('includes params when zero', () => {
        const msg = createJsonRpcRequestMessage(1, 'test', 0)
        expect(msg.params).toBe(0)
    })
})
