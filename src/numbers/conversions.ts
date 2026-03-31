import type { Numberish } from './types'
import { SUBSCRIPT_CHARS } from './constants'
import { roundTo } from './maths'

export function toSubscriptDigits(input: Numberish) {
    let result = ''

    for (const char of input.toString()) {
        result += SUBSCRIPT_CHARS[char] ?? char
    }

    return result
}

export function parseExponential(input: Numberish) {
    const str = input.toString().toLowerCase()
    const [mantissa, rawExp] = str.split('e')

    if (rawExp === undefined) {
        return str
    }

    const [rawInt, fracPart = ''] = mantissa?.split('.') ?? []

    if (!rawInt) {
        return str
    }

    const sign = rawInt.startsWith('-') ? '-' : ''
    const intPart = sign ? rawInt.slice(1) : rawInt
    const exp = Number(rawExp)

    if (exp >= 0) {
        const neededZeros = Math.max(0, exp - fracPart.length)
        const padded = fracPart + '0'.repeat(neededZeros)

        if (padded.length > exp) {
            return `${sign}${intPart}${padded.slice(0, exp)}.${padded.slice(exp)}`
        }

        return `${sign}${intPart}${padded}`
    }

    const absExp = -exp
    const digits = intPart + fracPart
    const totalLeadingZeros = Math.max(0, absExp - intPart.length)

    return `${sign}0.${'0'.repeat(totalLeadingZeros)}${digits}`
}

export function toOrdinal(n: number) {
    const remainder100 = Math.abs(n) % 100
    const remainder10 = remainder100 % 10

    if (remainder100 >= 11 && remainder100 <= 13) {
        return `${n}th`
    }

    switch (remainder10) {
        case 1:
            return `${n}st`
        case 2:
            return `${n}nd`
        case 3:
            return `${n}rd`
        default:
            return `${n}th`
    }
}

export function toPercent(value: number, total: number, decimals?: number) {
    if (total === 0) {
        return 0
    }

    const result = (value / total) * 100

    if (decimals === undefined) {
        return result
    }

    return roundTo(result, decimals)
}
