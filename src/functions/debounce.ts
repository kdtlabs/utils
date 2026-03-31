import type { Args, Fn, TimingControlled } from './types'
import { createTimerState, flushTimer, invokeTimer } from './timer-state'

export type Debounced<T extends Fn> = TimingControlled<T>

export function debounce<T extends Fn>(fn: T, wait: number): Debounced<T> {
    const state = createTimerState<T>()
    const invoke = () => invokeTimer(state, fn)

    const debounced: Debounced<T> = function (this: unknown, ...args: Args<T>) {
        state.lastArgs = args
        state.lastThis = this

        if (state.timeoutId !== undefined) {
            clearTimeout(state.timeoutId)
        }

        state.timeoutId = setTimeout(invoke, wait)
    }

    debounced.cancel = () => {
        if (state.timeoutId !== undefined) {
            clearTimeout(state.timeoutId)
            state.timeoutId = undefined
            state.lastArgs = undefined
        }
    }

    debounced.flush = () => {
        return flushTimer(state, invoke)
    }

    return debounced
}
