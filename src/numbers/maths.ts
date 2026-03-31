import { transform } from '../functions'

export const sum = (array: number[]) => array.reduce((a, b) => a + b, 0)

export const avg = (array: number[]) => (array.length === 0 ? 0 : sum(array) / array.length)

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const roundTo = (value: number, decimals: number) => (
    transform(10 ** decimals, (factor) => Math.round(value * factor) / factor)
)

export const lerp = (start: number, end: number, t: number) => start + (end - start) * t

export function median(array: number[]) {
    if (array.length === 0) {
        return 0
    }

    const sorted = [...array].toSorted((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1]! + sorted[mid]!) / 2
    }

    return sorted[mid]!
}
