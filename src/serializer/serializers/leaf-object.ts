import type { Jsonable } from '../../core'
import type { SerializeContext } from '../types'

export function serializeLeafObject(value: unknown, ctx: SerializeContext): Jsonable | undefined {
    if (value instanceof Date) {
        return ctx.replacer({ type: 'date', value: value.toISOString() })
    }

    if (value instanceof RegExp) {
        return ctx.replacer({ type: 'regexp', value: value.toString() })
    }

    if (value instanceof URL) {
        return ctx.replacer({ type: 'url', value: value.href })
    }

    return undefined
}
