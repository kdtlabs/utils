import { notNullish } from '../core'

export function isValidRange<T extends bigint | number>(start: T, end: T, inclusive = true, min?: T, max?: T) {
    if (notNullish(min) && start < min) {
        return false
    }

    if (notNullish(max) && end > max) {
        return false
    }

    return inclusive ? start <= end : start < end
}

export const isInRange = <T extends bigint | number>(value: T, min: T, max: T, inclusive = true) => (
    inclusive ? value >= min && value <= max : value > min && value < max
)
