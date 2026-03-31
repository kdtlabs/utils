import type { AnyObject } from '../objects'

export type NullToUndefined<T> = T extends null ? undefined : T extends Array<infer U> ? Array<NullToUndefined<U>> : T extends AnyObject ? { [K in keyof T]: NullToUndefined<T[K]> } : T
