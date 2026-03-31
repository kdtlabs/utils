import type { Jsonable } from '../../core'
import type { SerializeContext, SerializeValueFn } from '../types'
import { isArray } from '../../arrays'
import { isIterable } from '../../collections'
import { typeOf } from '../../core'
import { isPlainObject } from '../../objects'
import { type OMIT_SENTINEL, SERIALIZE } from '../constants'
import { serializeArray, serializeIterableEntries } from './array'
import { serializeBinary } from './binary'
import { serializeBlob } from './blob'
import { serializeCollection } from './collection'
import { serializeError } from './error'
import { serializeObject } from './object'
import { serializeOpaque } from './opaque'

export function serializeCompound(value: object, ctx: SerializeContext, serializeValue: SerializeValueFn): Jsonable | typeof OMIT_SENTINEL {
    const customSerialize = (value as Record<PropertyKey, unknown>)[SERIALIZE]

    if (typeof customSerialize === 'function') {
        return serializeValue((customSerialize as () => unknown)(), ctx)
    }

    if (isArray(value)) {
        return serializeArray(value, ctx, serializeValue)
    }

    const collection = serializeCollection(value, ctx, serializeValue)

    if (collection !== undefined) {
        return collection
    }

    const binary = serializeBinary(value, ctx)

    if (binary !== undefined) {
        return binary
    }

    const blob = serializeBlob(value, ctx)

    if (blob !== undefined) {
        return blob
    }

    if (value instanceof Error) {
        return ctx.replacer({ type: 'error', value: serializeError(value, ctx, serializeValue) })
    }

    if (isPlainObject(value)) {
        return serializeObject(value, ctx, serializeValue)
    }

    const opaque = serializeOpaque(value, ctx)

    if (opaque !== undefined) {
        return opaque
    }

    if (typeof (value as Record<string, unknown>).toJSON === 'function') {
        return serializeValue((value as { toJSON: () => unknown }).toJSON(), ctx)
    }

    if (isIterable(value)) {
        const name = value.constructor?.name
        const metadata: Record<string, Jsonable> = {}

        if (name) {
            metadata.name = name
        }

        return ctx.replacer({ metadata, type: 'iterable', value: serializeIterableEntries(value, ctx, serializeValue) })
    }

    if (ctx.onUnserializable) {
        return ctx.onUnserializable(value)
    }

    return ctx.replacer({ type: typeOf(value), value: `[${value.constructor?.name ?? typeOf(value)}]` })
}
