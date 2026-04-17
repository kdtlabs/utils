import type { Numberish, NumberString, Percentage } from './types'
import { isBigInt, isNumber, isString } from '../core'
import { SPECIAL_NUMBER_STRINGS } from './constants'

const NUMERIC_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu

export const isSpecialNumberString = (value: string) => SPECIAL_NUMBER_STRINGS.has(value)

export function isNumberString<TStrict extends boolean = true>(value: string): value is NumberString<TStrict> {
    if (isSpecialNumberString(value)) {
        return true
    }

    return NUMERIC_PATTERN.test(value)
}

export const isNumberish = <TStrict extends boolean = true>(input: unknown): input is Numberish<TStrict> => (
    isNumber(input) || isBigInt(input) || (isString(input) && isNumberString(input))
)

export const isPercentage = (value: number): value is Percentage => value >= 0 && value <= 100
