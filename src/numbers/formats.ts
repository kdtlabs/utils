import type { Numberish } from './types'
import { parseExponential, toSubscriptDigits } from './conversions'

export function countLeadingZeros(input: string) {
    let count = 0

    for (let i = 0; i < input.length && input[i] === '0'; i++) {
        count++
    }

    return count
}

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
    formatLeadingZeros?: (count: number) => string
    groupFractionLeadingZeros?: boolean
    locales?: Intl.LocalesArgument
}

export function formatNumber(input: Numberish, options_: FormatNumberOptions = {}) {
    const { formatLeadingZeros = (count: number) => `0${toSubscriptDigits(count)}`, groupFractionLeadingZeros = true, locales = 'en-US', maximumFractionDigits = 4, ...options } = options_

    const formatInput = (digits: number) => (
        new Intl.NumberFormat(locales, { ...options, maximumFractionDigits: digits }).format(input as Intl.StringNumericLiteral)
    )

    if (!groupFractionLeadingZeros) {
        return formatInput(maximumFractionDigits)
    }

    const numericStr = parseExponential(input)
    const [, fractionPart = ''] = numericStr.split('.', 2)
    const leadingZerosCount = countLeadingZeros(fractionPart)

    if (leadingZerosCount <= 1) {
        return formatInput(maximumFractionDigits)
    }

    const replaceFractionZeros = (part: Intl.NumberFormatPart) => {
        if (part.type === 'fraction') {
            return `${formatLeadingZeros(leadingZerosCount)}${part.value.slice(leadingZerosCount)}`
        }

        return part.value
    }

    const parts = new Intl.NumberFormat(locales, {
        ...options, maximumFractionDigits: maximumFractionDigits + leadingZerosCount,
    })

    return parts.formatToParts(input as Intl.StringNumericLiteral).map(replaceFractionZeros).join('')
}
