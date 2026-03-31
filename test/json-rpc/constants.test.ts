import { describe, expect, it } from 'bun:test'
import { JSON_RPC_ERROR_MESSAGES, JsonRpcErrorCode } from '@/json-rpc/constants'

describe('JsonRpcErrorCode', () => {
    it('ParseError is -32700', () => {
        expect(JsonRpcErrorCode.ParseError).toBe(-32_700)
    })

    it('InvalidRequest is -32600', () => {
        expect(JsonRpcErrorCode.InvalidRequest).toBe(-32_600)
    })

    it('MethodNotFound is -32601', () => {
        expect(JsonRpcErrorCode.MethodNotFound).toBe(-32_601)
    })

    it('InvalidParams is -32602', () => {
        expect(JsonRpcErrorCode.InvalidParams).toBe(-32_602)
    })

    it('InternalError is -32603', () => {
        expect(JsonRpcErrorCode.InternalError).toBe(-32_603)
    })
})

describe('JSON_RPC_ERROR_MESSAGES', () => {
    it('maps ParseError to its message', () => {
        expect(JSON_RPC_ERROR_MESSAGES[JsonRpcErrorCode.ParseError]).toBe('Parse error')
    })

    it('maps InvalidRequest to its message', () => {
        expect(JSON_RPC_ERROR_MESSAGES[JsonRpcErrorCode.InvalidRequest]).toBe('Invalid request')
    })

    it('maps MethodNotFound to its message', () => {
        expect(JSON_RPC_ERROR_MESSAGES[JsonRpcErrorCode.MethodNotFound]).toBe('Method not found')
    })

    it('maps InvalidParams to its message', () => {
        expect(JSON_RPC_ERROR_MESSAGES[JsonRpcErrorCode.InvalidParams]).toBe('Invalid params')
    })

    it('maps InternalError to its message', () => {
        expect(JSON_RPC_ERROR_MESSAGES[JsonRpcErrorCode.InternalError]).toBe('Internal error')
    })

    it('has an entry for every error code', () => {
        const numericValues = Object.values(JsonRpcErrorCode).filter((v): v is number => typeof v === 'number')

        for (const code of numericValues) {
            expect(JSON_RPC_ERROR_MESSAGES[code as JsonRpcErrorCode]).toBeString()
        }
    })
})
