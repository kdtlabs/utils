import type { SerializeContext } from '../types'
import type { Jsonable } from '@/core'
import { GENERATOR_PATTERNS } from '../constants'

export function serializeFunction(fn: (...args: unknown[]) => unknown, ctx: SerializeContext): Jsonable {
    const metadata: Record<string, Jsonable> = {}
    const str = fn.toString()

    metadata.async = str.startsWith('async')
    metadata.generator = GENERATOR_PATTERNS.test(str)

    return ctx.replacer({ metadata, type: 'function', value: { length: fn.length, name: fn.name || 'anonymous' } })
}
