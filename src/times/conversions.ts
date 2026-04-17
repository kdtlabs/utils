import { isString } from '../core'
import { BigIntMath, isSpecialNumberString, type Numberish } from '../numbers'
import { padZeroStart } from '../strings'

export const toUnixTimestamp = (date: Date) => Math.floor(date.getTime() / 1000)

export const fromUnixTimestamp = (timestamp: number) => new Date(timestamp * 1000)

export function uuidV7ToDate(uuid: string) {
    if (uuid.length !== 36 || uuid[8] !== '-' || uuid[14] !== '7') {
        throw new TypeError('Invalid UUIDv7')
    }

    let ms = 0

    for (let i = 0; i < 13; i++) {
        if (i === 8) {
            continue
        }

        const code = uuid.codePointAt(i)!

        let digit: number

        if (code >= 48 && code <= 57) {
            digit = code - 48
        } else if (code >= 97 && code <= 102) {
            digit = code - 87
        } else if (code >= 65 && code <= 70) {
            digit = code - 55
        } else {
            throw new TypeError('Invalid UUIDv7')
        }

        ms = ms * 16 + digit
    }

    return new Date(ms)
}

const FORMAT_TOKEN_REGEX = /y{4}|S{3}|MM|dd|HH|mm|ss/gu
const pad2 = (n: number) => padZeroStart(n, 2)

export function formatDate(date: Date, format = 'HH:mm:ss.SSS dd/MM/yyyy') {
    if (Number.isNaN(date.getTime())) {
        throw new TypeError('Invalid Date')
    }

    const tokens: Record<string, () => string> = {
        dd: () => pad2(date.getDate()),
        HH: () => pad2(date.getHours()),
        MM: () => pad2(date.getMonth() + 1),
        mm: () => pad2(date.getMinutes()),
        ss: () => pad2(date.getSeconds()),
        SSS: () => padZeroStart(date.getMilliseconds(), 3),
        yyyy: () => padZeroStart(date.getFullYear(), 4),
    }

    return format.replaceAll(FORMAT_TOKEN_REGEX, (match) => tokens[match]!())
}

const NANOSECOND_UNITS: Array<[label: string, value: bigint]> = [
    ['h', 3_600_000_000_000n],
    ['m', 60_000_000_000n],
    ['s', 1_000_000_000n],
    ['ms', 1_000_000n],
    ['\u03BCs', 1000n],
    ['ns', 1n],
]

export function humanizeNanoseconds(ns: Numberish) {
    if (isString(ns) && isSpecialNumberString(ns)) {
        return ns
    }

    let remaining: bigint

    try {
        remaining = BigInt(ns)
    } catch {
        return ns.toString()
    }

    if (remaining === 0n) {
        return '0ns'
    }

    const sign = remaining < 0n ? '-' : ''
    const parts: string[] = []

    remaining = BigIntMath.abs(remaining)

    for (const [label, value] of NANOSECOND_UNITS) {
        if (remaining >= value) {
            parts.push(`${remaining / value}${label}`)
            remaining %= value
        }
    }

    return sign + parts.join(' ')
}

export function humanizeWithMultiplier(value: Numberish, multiplier: bigint) {
    if (isString(value) && isSpecialNumberString(value)) {
        return value
    }

    try {
        return humanizeNanoseconds(BigInt(value) * multiplier)
    } catch {
        return value.toString()
    }
}

export const humanizeMilliseconds = (ms: Numberish) => humanizeWithMultiplier(ms, 1_000_000n)

export const humanizeSeconds = (s: Numberish) => humanizeWithMultiplier(s, 1_000_000_000n)
