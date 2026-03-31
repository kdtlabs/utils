import type { EmptyArray, NonEmptyArray } from './types'

export function nth(array: EmptyArray, index: number): undefined
export function nth<T>(array: NonEmptyArray<T>, index: number): T
export function nth<T>(array: T[], index: number): T | undefined

export function nth<T>(array: T[], index: number): T | undefined {
    return array.at(index)
}

export function first(array: EmptyArray): undefined
export function first<T>(array: NonEmptyArray<T>): T
export function first<T>(array: T[]): T | undefined

export function first<T>(array: T[]): T | undefined {
    return nth(array, 0)
}

export function last(array: EmptyArray): undefined
export function last<T>(array: NonEmptyArray<T>): T
export function last<T>(array: T[]): T | undefined

export function last<T>(array: T[]): T | undefined {
    return nth(array, -1)
}
