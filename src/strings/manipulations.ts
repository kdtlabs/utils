import type { Numberish } from '../numbers'
import { WHITESPACE_CHARACTERS } from './constants'

export const ensurePrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str : prefix + str)

export const ensureSuffix = (str: string, suffix: string) => (str.endsWith(suffix) ? str : str + suffix)

export const stripPrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str.slice(prefix.length) : str)

export const stripSuffix = (str: string, suffix: string) => (suffix.length > 0 && str.endsWith(suffix) ? str.slice(0, -suffix.length) : str)

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const escapeRegExp = (input: string) => (
    input.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`).replaceAll('-', String.raw`\x2d`)
)

export function * chunkStr(str: string, size: number) {
    if (size <= 0) {
        throw new RangeError(`chunk size must be a positive number, got ${size}`)
    }

    const len = str.length

    for (let i = 0; i < len; i += size) {
        yield str.slice(i, i + size)
    }
}

export const padStart = (str: string, targetLength: number, padString = ' ') => (
    str.padStart(targetLength, padString)
)

export const padZeroStart = (num: Numberish | string, targetLength: number) => padStart(num.toString(), targetLength, '0')

export function truncate(str: string, maxLength: number, omission = '...') {
    if (str.length <= maxLength) {
        return str
    }

    if (omission.length >= maxLength) {
        return omission.slice(0, maxLength)
    }

    return str.slice(0, maxLength - omission.length) + omission
}

export function truncateMiddle(str: string, maxLength: number, omission = '...') {
    if (str.length <= maxLength) {
        return str
    }

    if (omission.length >= maxLength) {
        return omission.slice(0, maxLength)
    }

    const left = Math.floor((maxLength - omission.length) / 2)
    const right = maxLength - omission.length - left

    return str.slice(0, left) + omission + str.slice(-right)
}

export function ltrim(str: string, characters: Set<string> | string = WHITESPACE_CHARACTERS) {
    if (typeof characters === 'string') {
        characters = new Set(characters)
    }

    const end = str.length

    let start = 0

    while (start < end && characters.has(str[start]!)) {
        start++
    }

    return start > 0 ? str.slice(start, end) : str
}

export function rtrim(str: string, characters: Set<string> | string = WHITESPACE_CHARACTERS) {
    if (typeof characters === 'string') {
        characters = new Set(characters)
    }

    let end = str.length

    while (end > 0 && characters.has(str[end - 1]!)) {
        end--
    }

    return end < str.length ? str.slice(0, end) : str
}

export const trim = (str: string, characters: Set<string> | string = WHITESPACE_CHARACTERS) => (
    ltrim(rtrim(str, characters), characters)
)

export const trimRepeated = (input: string, target: string) => (
    input.replaceAll(new RegExp(`(?:${escapeRegExp(target)}){2,}`, 'g'), target)
)
