import type { SerializeContext, SerializeValueFn } from '../types'
import type { Jsonable } from '@/core/types'
import { OMIT_SENTINEL } from '../constants'

export function handlePropertyAccessError(error: unknown, strategy: SerializeContext['onPropertyAccess'], key: string | symbol, ctx: SerializeContext): Jsonable | typeof OMIT_SENTINEL {
    if (strategy === 'throw') {
        throw error
    }

    if (strategy === 'omit') {
        return OMIT_SENTINEL
    }

    return ctx.replacer({ type: 'property-access-error', value: `[Property Access Error: ${String(key)}]` })
}

export function safeAccess(obj: object, key: string | symbol, strategy: SerializeContext['onPropertyAccess'], ctx: SerializeContext): unknown {
    try {
        return (obj as Record<string | symbol, unknown>)[key]
    } catch (error) {
        return handlePropertyAccessError(error, strategy, key, ctx)
    }
}

export function serializeObject(obj: object, ctx: SerializeContext, serializeValue: SerializeValueFn): Record<string, Jsonable> {
    const result: Record<string, Jsonable> = {}
    const { onPropertyAccess, symbolRegistry } = ctx

    for (const key of Object.keys(obj)) {
        const value = safeAccess(obj, key, onPropertyAccess, ctx)

        if (value === OMIT_SENTINEL) {
            continue
        }

        const serializedValue = serializeValue(value, ctx)

        if (serializedValue === OMIT_SENTINEL) {
            continue
        }

        result[key] = serializedValue
    }

    for (const sym of Object.getOwnPropertySymbols(obj)) {
        const value = safeAccess(obj, sym, onPropertyAccess, ctx)

        if (value === OMIT_SENTINEL) {
            continue
        }

        const serializedValue = serializeValue(value, ctx)

        if (serializedValue === OMIT_SENTINEL) {
            continue
        }

        result[symbolRegistry(sym)] = serializedValue
    }

    return result
}
