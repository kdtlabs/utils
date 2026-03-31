import { describe, expect, it } from 'bun:test'
import { createJsonRpcNotifyMessage } from '@/json-rpc/factories'

describe('createJsonRpcNotifyMessage', () => {
    it('creates a notify message without params', () => {
        expect(createJsonRpcNotifyMessage('update')).toEqual({
            jsonrpc: '2.0',
            method: 'update',
        })
    })

    it('creates a notify message with params', () => {
        expect(createJsonRpcNotifyMessage('update', { a: 1 })).toEqual({
            jsonrpc: '2.0',
            method: 'update',
            params: { a: 1 },
        })
    })

    it('creates a notify message with array params', () => {
        expect(createJsonRpcNotifyMessage('update', [1, 2, 3])).toEqual({
            jsonrpc: '2.0',
            method: 'update',
            params: [1, 2, 3],
        })
    })

    it('does not include params when undefined', () => {
        const msg = createJsonRpcNotifyMessage('test')
        expect('params' in msg).toBe(false)
    })

    it('includes params when null', () => {
        const msg = createJsonRpcNotifyMessage('test', null)
        expect(msg.params).toBeNull()
    })

    it('includes params when false', () => {
        const msg = createJsonRpcNotifyMessage('test', false)
        expect(msg.params).toBe(false)
    })

    it('includes params when zero', () => {
        const msg = createJsonRpcNotifyMessage('test', 0)
        expect(msg.params).toBe(0)
    })

    it('includes params when empty string', () => {
        const msg = createJsonRpcNotifyMessage('test', '')
        expect(msg.params).toBe('')
    })
})
