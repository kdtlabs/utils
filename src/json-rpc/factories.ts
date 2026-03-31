import type { JsonRpcErrorObject, JsonRpcErrorResponseMessage, JsonRpcNotifyMessage, JsonRpcRequestMessage, JsonRpcResponseId, JsonRpcSuccessResponseMessage } from './types'
import { notUndefined } from '../core'

export const createJsonRpcNotifyMessage = <TParams>(method: string, params?: TParams): JsonRpcNotifyMessage<TParams> => ({
    jsonrpc: '2.0', method, ...(notUndefined(params) ? { params } : {}),
})

export const createJsonRpcRequestMessage = <TParams>(id: number | string, method: string, params?: TParams): JsonRpcRequestMessage<TParams> => ({
    id, jsonrpc: '2.0', method, ...(notUndefined(params) ? { params } : {}),
})

export const createJsonRpcSuccessResponseMessage = <TResult = any>(id: JsonRpcResponseId, result: TResult): JsonRpcSuccessResponseMessage<TResult> => ({
    id, jsonrpc: '2.0', result,
})

export const createJsonRpcErrorObject = <TData>(code: number, message: string, data?: TData): JsonRpcErrorObject<TData> => ({
    code, message, ...(notUndefined(data) ? { data } : {}),
})

export const createJsonRpcErrorResponseMessage = <TData>(id: JsonRpcResponseId, error: JsonRpcErrorObject<TData>): JsonRpcErrorResponseMessage<TData> => ({
    error, id, jsonrpc: '2.0',
})
