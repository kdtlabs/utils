import type { Fn } from './types'

export const isFunction = <T extends Fn>(value: unknown): value is T => (
    typeof value === 'function'
)
