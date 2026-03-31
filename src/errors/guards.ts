import type { ErrorLike } from './types'
import { isString } from '../core'
import { isKeysOf, isObject } from '../objects'
import { BaseError } from './base-error'

export const isError = (value: unknown): value is Error => value instanceof Error

export const isBaseError = (value: unknown): value is BaseError => value instanceof BaseError

export const isAbortError = (error: unknown): error is DOMException => error instanceof DOMException && error.name === 'AbortError'

export const isErrorLike = (value: unknown): value is ErrorLike => isObject(value) && isKeysOf(value, 'name') && isString(value.name)
