import type { Jsonable } from '../core'
import type { SerializeContext, SerializeOptions, SharedSerializeContext } from './types'
import { OMIT_SENTINEL } from './constants'
import { createContext, createSharedContext } from './context'
import { serializeCompound } from './serializers/compound'
import { serializeLeafObject } from './serializers/leaf-object'
import { serializePrimitive } from './serializers/primitive'
import { handleError } from './utils'

export const createSerializerWithContext = (ctx: SharedSerializeContext) => {
    return (value: unknown) => serializeWithContext(value, { ...ctx, depth: 0, visited: new Set() })
}

export const createSerializer = (options?: SerializeOptions) => (
    createSerializerWithContext(createSharedContext(options))
)

export const serialize = (value: unknown, options?: SerializeOptions): Jsonable => (
    serializeWithContext(value, createContext(options))
)

export function serializeWithContext(value: unknown, ctx: SerializeContext) {
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
