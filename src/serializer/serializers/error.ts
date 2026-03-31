import type { ErrorPropertyValue, SerializeContext, SerializeValueFn } from '../types'
import type { Jsonable } from '@/core'
import { OMIT_SENTINEL } from '../constants'
import { handlePropertyAccessError } from './object'

export const isUsableValue = (value: ErrorPropertyValue): value is Jsonable => (
    value !== undefined && value !== OMIT_SENTINEL
)

export function readProperty(error: Error, key: string | symbol, ctx: SerializeContext, serializeValue: SerializeValueFn): ErrorPropertyValue {
    try {
        const value = (error as unknown as Record<string | symbol, unknown>)[key]

        if (value === undefined) {
            return undefined
        }

        return serializeValue(value, ctx)
    } catch (error_) {
        return handlePropertyAccessError(error_, ctx.onPropertyAccess, key, ctx)
    }
}

export function serializeErrorCoreFields(error: Error, ctx: SerializeContext, serializeValue: SerializeValueFn): Record<string, Jsonable> {
    const result: Record<string, Jsonable> = { name: error.name }
    const serializedMessage = readProperty(error, 'message', ctx, serializeValue)
    const serializedStack = readProperty(error, 'stack', ctx, serializeValue)
    const serializedCause = readProperty(error, 'cause', ctx, serializeValue)

    if (typeof serializedMessage === 'string' && serializedMessage.length > 0) {
        result.message = serializedMessage
    }

    if (typeof serializedStack === 'string' && serializedStack.length > 0) {
        result.stack = serializedStack
    }

    if (isUsableValue(serializedCause)) {
        result.cause = serializedCause
    }

    if (error instanceof AggregateError) {
        const serializedErrors = readProperty(error, 'errors', ctx, serializeValue)

        if (isUsableValue(serializedErrors)) {
            result.errors = serializedErrors
        }
    }

    return result
}

export function serializeError(error: Error, ctx: SerializeContext, serializeValue: SerializeValueFn): Record<string, Jsonable> {
    const result = serializeErrorCoreFields(error, ctx, serializeValue)

    for (const key of Object.keys(error)) {
        if (!(key in result)) {
            const serializedValue = readProperty(error, key, ctx, serializeValue)

            if (isUsableValue(serializedValue)) {
                result[key] = serializedValue
            }
        }
    }

    for (const sym of Object.getOwnPropertySymbols(error)) {
        const serializedValue = readProperty(error, sym, ctx, serializeValue)

        if (isUsableValue(serializedValue)) {
            result[ctx.symbolRegistry(sym)] = serializedValue
        }
    }

    return result
}
