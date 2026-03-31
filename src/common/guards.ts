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

export function isDeepEqual(a: unknown, b: unknown): boolean {
    if (a === b) {
        return true
    }

    if (isArray(a) && isArray(b)) {
        if (a.length !== b.length) {
            return false
        }

        return a.every((item, i) => isDeepEqual(item, b[i]))
    }

    if (isPlainObject(a) && isPlainObject(b)) {
        const keysA = Object.keys(a)

        if (keysA.length !== Object.keys(b).length) {
            return false
        }

        return keysA.every((key) => isDeepEqual(a[key], b[key]))
    }

    return Object.is(a, b)
}
