export function random(min: number, max: number) {
    const lo = Math.min(min, max)
    const hi = Math.max(min, max)

    return Math.floor(Math.random() * (hi - lo + 1)) + lo
}
