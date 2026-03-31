import type { Nullish } from '../core'
import type { Fn } from './types'

export const noop = () => void 0

export const invoke = <T>(fn: () => T) => fn()

export function invokes(functions: Array<Nullish<Fn>>) {
    for (const fn of functions) {
        fn?.()
    }
}
