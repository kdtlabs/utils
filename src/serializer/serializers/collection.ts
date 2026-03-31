import type { Jsonable } from '../../core'
import type { SerializeContext, SerializeValueFn } from '../types'
import { isCollectionLike, isMapLike, isSetLike } from '../../collections'
import { serializeIterableEntries } from './array'

export function serializeCollection(value: object, ctx: SerializeContext, serializeValue: SerializeValueFn): Jsonable | undefined {
    if (isCollectionLike(value)) {
        const name = value.constructor?.name
        const metadata: Record<string, Jsonable> = { size: value.size }

        if (name) {
            metadata.name = name
        }

        if (isMapLike(value)) {
            return ctx.replacer({ metadata, type: 'map', value: serializeIterableEntries(value.entries(), ctx, serializeValue) })
        }

        if (isSetLike(value)) {
            return ctx.replacer({ metadata, type: 'set', value: serializeIterableEntries(value, ctx, serializeValue) })
        }
    }

    return undefined
}
