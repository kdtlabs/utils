import { isArray, isEmptyArray } from '@/arrays'
import { isCollectionLike, isEmptyCollection } from '@/collections'
import { isNullish, isPrimitive, isString } from '@/core'
import { isEmptyObject, isPlainObject } from '@/objects'

export function isEmpty(value: unknown) {
    if (isNullish(value)) {
        return true
    }

    if (isArray(value)) {
        return isEmptyArray(value)
    }

    if (isPrimitive(value)) {
        if (isString(value)) {
            return value.length === 0
        }

        return false
    }

    if (isPlainObject(value)) {
        return isEmptyObject(value)
    }

    if (isCollectionLike(value)) {
        return isEmptyCollection(value)
    }

    return false
}
