import type { NullToUndefined } from './types'
import { isArray } from '@/arrays'
import { isNullish } from '@/core'
import { isPlainObject, map } from '@/objects'

export function nullToUndefined<T>(value: T): NullToUndefined<T> {
    if (isNullish(value)) {
        return undefined as NullToUndefined<T>
    }

    if (isArray(value)) {
        return value.map(nullToUndefined) as NullToUndefined<T>
    }

    if (isPlainObject(value)) {
        return map(value, (k, v) => [k, nullToUndefined(v)]) as NullToUndefined<T>
    }

    return value as NullToUndefined<T>
}
