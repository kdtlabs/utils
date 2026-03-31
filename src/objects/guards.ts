import type { AnyObject, UnknownObject } from './types'
import { isArray } from '../arrays'
import { toString } from '../core'

export const isObject = (value: unknown): value is AnyObject => value !== null && typeof value === 'object' && !isArray(value)

export const isPlainObject = (value: unknown): value is UnknownObject => {
    if (toString(value) !== '[object Object]') {
        return false
    }

    const proto = Object.getPrototypeOf(value)

    return proto === null || proto === Object.prototype
}

export const isEmptyObject = (value: AnyObject) => Object.keys(value).length === 0

export const isKeyOf = <T extends AnyObject>(obj: T, name: PropertyKey): name is keyof T => name in obj

export const isKeysOf = <T extends PropertyKey>(data: AnyObject, ...keys: T[]): data is Record<T, unknown> => keys.every((key) => isKeyOf(data, key))
