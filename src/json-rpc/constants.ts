export enum JsonRpcErrorCode {
    ParseError = -32_700,
    InternalError = -32_603,
    InvalidParams = -32_602,
    MethodNotFound = -32_601,
    InvalidRequest = -32_600,
}

export const JSON_RPC_ERROR_MESSAGES: Record<JsonRpcErrorCode, string> = {
    [JsonRpcErrorCode.InternalError]: 'Internal error',
    [JsonRpcErrorCode.InvalidParams]: 'Invalid params',
    [JsonRpcErrorCode.InvalidRequest]: 'Invalid request',
    [JsonRpcErrorCode.MethodNotFound]: 'Method not found',
    [JsonRpcErrorCode.ParseError]: 'Parse error',
}
