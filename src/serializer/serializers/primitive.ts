import type { SerializeContext } from '../types'
import type { Jsonable } from '@/core'
import { isBigInt, isJsonablePrimitive, isNumber, isSymbol } from '@/core'
import { serializeNumber } from './number'

export function serializePrimitive(value: unknown, ctx: SerializeContext): Jsonable | undefined {
    if (value === null) {
        return null
    }

    if (value === undefined) {
        return ctx.replacer({ type: 'undefined', value: null })
    }

    if (isNumber(value)) {
        return serializeNumber(value, ctx)
    }

    if (isJsonablePrimitive(value)) {
        return value
    }

    if (isBigInt(value)) {
        return ctx.replacer({ type: 'bigint', value: value.toString() })
    }

    if (isSymbol(value)) {
        return ctx.replacer({ type: 'symbol', value: ctx.symbolRegistry(value) })
    }

    return undefined
}
