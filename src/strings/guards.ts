import type { Nullish } from '../core'
import type { HexString, UrlLike } from './types'
import { wrap } from '../arrays'
import { transform, tryCatch } from '../functions'

export const isEmptyString = (value: string) => value.length === 0

export function isValidProtocol({ protocol }: URL, protocols?: Nullish<string[]>) {
    if (!protocols?.length) {
        return true
    }

    return protocols.some((x) => `${x.toLowerCase()}:` === protocol)
}

export function isValidUrl(url: UrlLike, protocols?: Nullish<string[]>) {
    if (url instanceof URL) {
        return isValidProtocol(url, protocols)
    }

    return tryCatch(() => isValidProtocol(new URL(url), protocols), false)
}

export const isWebSocketUrl = (url: UrlLike, wsProtocols = ['ws', 'wss']) => isValidUrl(url, wsProtocols)

export const isHttpUrl = (url: UrlLike, httpProtocols = ['http', 'https']) => isValidUrl(url, httpProtocols)

export const isStringEquals = (str: string, ...others: string[]) => others.length > 0 && others.every((other) => str === other)

export const isStringEqualsIgnoreCase = (str: string, ...others: string[]) => (
    others.length > 0 && transform(str.toLowerCase(), (x) => others.every((other) => x === other.toLowerCase()))
)

export const isIncludesAll = (str: string, search: string[]) => search.every((s) => str.includes(s))

export const isIncludesAny = (str: string, search: string[]) => search.some((s) => str.includes(s))

export const isIncludes = (str: string, search: string[] | string, type: 'all' | 'any' = 'all') => (
    type === 'all' ? isIncludesAll(str, wrap(search)) : isIncludesAny(str, wrap(search))
)

export function isHexString(value: string, length?: number) {
    const len = length ? `{${length * 2}}` : '+'
    const regex = new RegExp(`^(?:0x)?[0-9a-f]${len}$`, 'iu')

    return regex.test(value)
}

export const isStrictHexString = (value: string, length?: number): value is HexString => (
    value.startsWith('0x') && isHexString(value, length)
)
