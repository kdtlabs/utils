import { describe, expect, it } from 'bun:test'
import { createJsonRpcErrorObject } from '../../../src/json-rpc/factories'

describe('createJsonRpcErrorObject', () => {
    it('creates an error object without data', () => {
        expect(createJsonRpcErrorObject(-32_600, 'Invalid Request')).toEqual({
            code: -32_600,
            message: 'Invalid Request',
        })
    })

    it('creates an error object with data', () => {
        expect(createJsonRpcErrorObject(-32_000, 'Server error', { detail: 'x' })).toEqual({
            code: -32_000,
            data: { detail: 'x' },
            message: 'Server error',
        })
    })

    it('creates an error object with string data', () => {
        expect(createJsonRpcErrorObject(-1, 'fail', 'extra info')).toEqual({
            code: -1,
            data: 'extra info',
            message: 'fail',
        })
    })

    it('creates an error object with null data', () => {
        const result = createJsonRpcErrorObject(-1, 'fail', null)
        expect(result.data).toBeNull()
    })

    it('does not include data when undefined', () => {
        const result = createJsonRpcErrorObject(-1, 'fail')
        expect('data' in result).toBe(false)
    })

    it('does not include data when omitted', () => {
        const result = createJsonRpcErrorObject(-1, 'fail')
        expect('data' in result).toBe(false)
    })

    it('includes data when false', () => {
        const result = createJsonRpcErrorObject(-1, 'fail', false)
        expect(result.data).toBe(false)
    })

    it('includes data when zero', () => {
        const result = createJsonRpcErrorObject(-1, 'fail', 0)
        expect(result.data).toBe(0)
    })
})
