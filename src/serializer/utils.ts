import type { Jsonable } from '../core'
import type { SerializeContext, SerializeErrorStrategy } from './types'
import { OMIT_SENTINEL } from './constants'

export function handleError(strategy: SerializeErrorStrategy, type: string, placeholder: string, ctx: SerializeContext): Jsonable | typeof OMIT_SENTINEL {
    if (strategy === 'throw') {
        throw new Error(placeholder)
    }

    if (strategy === 'omit') {
        return OMIT_SENTINEL
    }

    return ctx.replacer({ type, value: placeholder })
}
