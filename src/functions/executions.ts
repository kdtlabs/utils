import type { Fn } from './types'
import type { Nullish } from '@/core'

export const noop = () => void 0

export const invoke = <T>(fn: () => T) => fn()

export function invokes(functions: Array<Nullish<Fn>>) {
    for (const fn of functions) {
        fn?.()
    }
}
