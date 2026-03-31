export const unique = <T>(array: T[]) => [...new Set(array)]

export const uniqueBy = <T>(array: T[], equalFn: (a: T, b: T) => boolean) => (
    array.reduce<T[]>((r, c) => (r.some((v) => equalFn(v, c)) ? r : [...r, c]), [])
)

export const intersection = <T>(a: T[], b: T[]) => a.filter((v) => b.includes(v))

export const diff = <T>(a: T[], b: T[]) => a.filter((v) => !b.includes(v))

export const symmetricDiff = <T>(a: T[], b: T[]) => [...diff(a, b), ...diff(b, a)]
