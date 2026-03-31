import type { SerializeContext, SerializeOptions } from './types'
import type { Jsonable } from '@/core/types'
import { OMIT_SENTINEL } from './constants'
import { createContext } from './context'
import { serializeCompound } from './serializers/compound'
import { serializeLeafObject } from './serializers/leaf-object'
import { serializePrimitive } from './serializers/primitive'
import { handleError } from './utils'

export function serialize(value: unknown, options?: SerializeOptions): Jsonable {
    const ctx = createContext(options)
    const serializedValue = serializeValue(value, ctx)

    if (serializedValue === OMIT_SENTINEL) {
        return null
    }

    return serializedValue
}

export function serializeValue(value: unknown, ctx: SerializeContext): Jsonable | typeof OMIT_SENTINEL {
    const primitive = serializePrimitive(value, ctx)

    if (primitive !== undefined) {
        return primitive
    }

    const leaf = serializeLeafObject(value, ctx)

    if (leaf !== undefined) {
        return leaf
    }

    if (ctx.visited.has(value as object)) {
        return handleError(ctx.onCircularRef, 'circular-ref', '[Circular]', ctx)
    }

    if (ctx.depth >= ctx.maxDepth) {
        return handleError(ctx.onMaxDepth, 'max-depth', '[Max Depth]', ctx)
    }

    ctx.visited.add(value as object)
    ctx.depth++

    try {
        return serializeCompound(value as object, ctx, serializeValue)
    } finally {
        ctx.depth--
        ctx.visited.delete(value as object)
    }
}
