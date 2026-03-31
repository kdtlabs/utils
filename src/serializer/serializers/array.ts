import type { Jsonable } from '../../core'
import type { SerializeContext, SerializeValueFn } from '../types'
import { OMIT_SENTINEL } from '../constants'

export function serializeArrayEntry(entry: unknown, ctx: SerializeContext, serializeValue: SerializeValueFn): Jsonable {
    const serializedValue = serializeValue(entry, ctx)

    return serializedValue === OMIT_SENTINEL ? null : serializedValue
}

export const serializeArray = (value: unknown[], ctx: SerializeContext, serializeValue: SerializeValueFn): Jsonable[] => (
    value.map((entry) => serializeArrayEntry(entry, ctx, serializeValue))
)

export const serializeIterableEntries = (value: Iterable<unknown>, ctx: SerializeContext, serializeValue: SerializeValueFn): Jsonable[] => (
    Array.from(value, (entry) => serializeArrayEntry(entry, ctx, serializeValue))
)
