export const toString = (value: unknown) => Object.prototype.toString.call(value)

export function typeOf(value: unknown): string {
    if (value === null) {
        return 'null'
    }

    return typeof value === 'object' || typeof value === 'function' ? toString(value).slice(8, -1).toLowerCase() : typeof value
}
