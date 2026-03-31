import type { SerializeContext } from '../types'
import type { Jsonable } from '@/core'

export function serializeNumber(value: number, ctx: SerializeContext): Jsonable {
    if (Number.isNaN(value)) {
        return ctx.replacer({ type: 'number', value: 'NaN' })
    }

    if (!Number.isFinite(value)) {
        return ctx.replacer({ type: 'number', value: value > 0 ? 'Infinity' : '-Infinity' })
    }

    return value
}
