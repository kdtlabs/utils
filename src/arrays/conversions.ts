import type { MaybeArray } from './types'
import { isIterable } from '../collections'
import { notNullish, type Nullable } from '../core'
import { isArray } from './guards'

export const wrap = <T>(array: T | T[]) => (isArray(array) ? array : [array])

export function toArray<T>(value?: Nullable<MaybeArray<T>>) {
    if (isIterable(value)) {
        return [...value]
    }

    return wrap(value ?? [])
}

export const compact = <T>(array: Array<Nullable<T>>): T[] => array.filter(notNullish)
