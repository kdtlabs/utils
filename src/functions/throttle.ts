import type { Args, Fn, TimingControlled } from './types'
import { createTimerState, flushTimer, invokeTimer } from './timer-state'

export type Throttled<T extends Fn> = TimingControlled<T>

export function throttle<T extends Fn>(fn: T, wait: number): Throttled<T> {
    const state = createTimerState<T>()

    let lastCallTime: number | undefined

    const invoke = () => {
        lastCallTime = Date.now()
        invokeTimer(state, fn)
    }

    const throttled: Throttled<T> = function (this: unknown, ...args: Args<T>) {
        const now = Date.now()

        state.lastArgs = args
        state.lastThis = this

        if (lastCallTime === undefined) {
            lastCallTime = now
            state.lastResult = fn.apply(this, args)

            return
        }

        const remaining = wait - (now - lastCallTime)

        if (remaining <= 0) {
            if (state.timeoutId !== undefined) {
                clearTimeout(state.timeoutId)
                state.timeoutId = undefined
            }

            lastCallTime = now
            state.lastResult = fn.apply(this, args)
        } else {
            state.timeoutId ??= setTimeout(invoke, remaining)
        }
    }

    throttled.cancel = () => {
        if (state.timeoutId !== undefined) {
            clearTimeout(state.timeoutId)
            state.timeoutId = undefined
        }

        state.lastArgs = undefined
        lastCallTime = undefined
    }

    throttled.flush = () => {
        return flushTimer(state, invoke)
    }

    return throttled
}
