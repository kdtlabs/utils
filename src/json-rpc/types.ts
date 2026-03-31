export interface BaseJsonRpcMessage {
    jsonrpc: '2.0'
}

export interface JsonRpcRequestMessage<TParams = any> extends BaseJsonRpcMessage {
    id: number | string
    method: string
    params?: TParams
}

export interface JsonRpcNotifyMessage<TParams = any> extends BaseJsonRpcMessage {
    method: string
    params?: TParams
}

export interface JsonRpcErrorObject<TData = any> {
    code: number
    data?: TData
    message: string
}

export type JsonRpcResponseId = number | string | null

export interface BaseJsonRpcResponseMessage extends BaseJsonRpcMessage {
    id: JsonRpcResponseId
}

export interface JsonRpcSuccessResponseMessage<TResult = any> extends BaseJsonRpcResponseMessage {
    result: TResult
}

export interface JsonRpcErrorResponseMessage<TData = any> extends BaseJsonRpcResponseMessage {
    error: JsonRpcErrorObject<TData>
}

export type JsonRpcResponseMessage<TResult = any, TErrorData = any> = JsonRpcErrorResponseMessage<TErrorData> | JsonRpcSuccessResponseMessage<TResult>

export type JsonRpcResponseBodyWithoutId<TResult = any, TErrorData = any> = Omit<JsonRpcErrorResponseMessage<TErrorData>, 'id'> | Omit<JsonRpcSuccessResponseMessage<TResult>, 'id'>

export type JsonRpcResponseMessageWithNonNullId<TResult = any, TErrorData = any> = JsonRpcResponseBodyWithoutId<TResult, TErrorData> & {
    id: NonNullable<JsonRpcResponseId>
}

export type JsonRpcMessage<TParams = any, TResult = any, TErrorData = any> = JsonRpcNotifyMessage<TParams> | JsonRpcRequestMessage<TParams> | JsonRpcResponseMessage<TResult, TErrorData>

export type JsonRpcBatchRequest<TParams = any> = Array<JsonRpcNotifyMessage<TParams> | JsonRpcRequestMessage<TParams>>

export type JsonRpcBatchResponse<TResult = any, TErrorData = any> = Array<JsonRpcResponseMessage<TResult, TErrorData>>
