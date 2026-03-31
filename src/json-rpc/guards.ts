import type { JsonRpcBatchRequest, JsonRpcBatchResponse, JsonRpcErrorObject, JsonRpcErrorResponseMessage, JsonRpcMessage, JsonRpcNotifyMessage, JsonRpcRequestMessage, JsonRpcResponseId, JsonRpcResponseMessage, JsonRpcResponseMessageWithNonNullId, JsonRpcSuccessResponseMessage } from './types'
import { isArray } from '../arrays'
import { isNull, isNumber, isString, notNullish } from '../core'
import { isKeysOf, isObject } from '../objects'

export const isJsonRpcMessage = <TParams = any, TResult = any, TErrorData = any>(message: unknown): message is JsonRpcMessage<TParams, TResult, TErrorData> => (
    isObject(message) && message.jsonrpc === '2.0'
)

export const isValidJsonRpcId = (id: unknown): id is JsonRpcResponseId => isString(id) || isNumber(id) || isNull(id)

export const isJsonRpcRequestMessage = <TParams = any>(message: JsonRpcMessage): message is JsonRpcRequestMessage<TParams> => (
    isKeysOf(message, 'id', 'method') && isValidJsonRpcId(message.id) && isString(message.method)
)

export const isJsonRpcNotifyMessage = <TParams = any>(message: JsonRpcMessage): message is JsonRpcNotifyMessage<TParams> => (
    isKeysOf(message, 'method') && isString(message.method) && !isKeysOf(message, 'id')
)

export const isJsonRpcResponseMessage = <TResult = any, TErrorData = any>(message: JsonRpcMessage): message is JsonRpcResponseMessage<TResult, TErrorData> => (
    isKeysOf(message, 'id') && isValidJsonRpcId(message.id) && !isKeysOf(message, 'method')
)

export const isJsonRpcError = <TData = any>(message: unknown): message is JsonRpcErrorObject<TData> => (
    isObject(message) && isKeysOf(message, 'code', 'message')
)

export const isJsonRpcErrorResponseMessage = <TData = any>(message: JsonRpcMessage): message is JsonRpcErrorResponseMessage<TData> => (
    isKeysOf(message, 'error') && isJsonRpcError(message.error)
)

export const isJsonRpcSuccessResponseMessage = <TResult = any>(message: JsonRpcMessage): message is JsonRpcSuccessResponseMessage<TResult> => (
    isKeysOf(message, 'result') && !isKeysOf(message, 'error')
)

export const isJsonRpcResponseHasNonNullableId = <TResult = any, TErrorData = any>(response: JsonRpcResponseMessage): response is JsonRpcResponseMessageWithNonNullId<TResult, TErrorData> => (
    notNullish(response.id)
)

export const isJsonRpcBatchRequest = <TParams = any>(value: unknown): value is JsonRpcBatchRequest<TParams> => (
    isArray(value) && value.length > 0 && value.every((item) => {
        if (!isJsonRpcMessage(item)) {
            return false
        }

        return isJsonRpcRequestMessage(item) || isJsonRpcNotifyMessage(item)
    })
)

export const isJsonRpcBatchResponse = <TResult = any, TErrorData = any>(value: unknown): value is JsonRpcBatchResponse<TResult, TErrorData> => (
    isArray(value) && value.length > 0 && value.every((item) => {
        if (!isJsonRpcMessage(item)) {
            return false
        }

        return isJsonRpcResponseMessage(item)
    })
)
