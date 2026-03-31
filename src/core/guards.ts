import type { JsonablePrimitive, Primitive } from './types'
import { DEFAULT_TRUE_STRINGS } from './constants'

export const toString = (value: unknown) => Object.prototype.toString.call(value)

export function typeOf(value: unknown): string {
    if (value === null) {
        return 'null'
    }

    return typeof value === 'object' || typeof value === 'function' ? toString(value).slice(8, -1).toLowerCase() : typeof value
}

export const isNull = (value: unknown): value is null => value === null
export const isUndefined = (value: unknown): value is undefined => value === undefined
export const isNullish = (value: unknown): value is null | undefined => isNull(value) || isUndefined(value)

export const notNull = <T>(value: T): value is Exclude<T, null> => !isNull(value)
export const notUndefined = <T>(value: T): value is Exclude<T, undefined> => !isUndefined(value)
export const notNullish = <T>(value: T): value is NonNullable<T> => !isNullish(value)

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isSymbol = (value: unknown): value is symbol => typeof value === 'symbol'
export const isBigInt = (value: unknown): value is bigint => typeof value === 'bigint'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isString = (value: unknown): value is string => typeof value === 'string'
export const isDate = (value: unknown): value is Date => value instanceof Date

export const isPrimitive = (value: unknown): value is Primitive => value === null || (typeof value !== 'object' && typeof value !== 'function')

export const isJsonablePrimitive = (value: unknown): value is JsonablePrimitive => (
    isNull(value) || isString(value) || isBoolean(value) || (isNumber(value) && Number.isFinite(value))
)

export interface IsTrueLikeOptions {
    anyNonZeroNumber?: boolean
    trueStrings?: Set<string>
}

export function isTrueLike(value: unknown, options: IsTrueLikeOptions = {}) {
    const { anyNonZeroNumber = false, trueStrings = DEFAULT_TRUE_STRINGS } = options

    if (isBoolean(value)) {
        return value
    }

    if (isString(value)) {
        return trueStrings.has(value.toLowerCase())
    }

    if (isNumber(value)) {
        return anyNonZeroNumber ? value !== 0 && Number.isFinite(value) : value === 1
    }

    if (isBigInt(value)) {
        return anyNonZeroNumber ? value !== 0n : value === 1n
    }

    return false
}

export const isGenerator = (value: unknown): boolean => (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<PropertyKey, unknown>).next === 'function' &&
    typeof (value as Record<PropertyKey, unknown>)[Symbol.iterator] === 'function'
)
