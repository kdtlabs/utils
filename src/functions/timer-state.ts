import type { Args, Fn } from './types'

export interface TimerState<T extends Fn> {
    lastArgs: Args<T> | undefined
    lastResult: ReturnType<T> | undefined
    lastThis: unknown
    timeoutId: ReturnType<typeof setTimeout> | undefined
}

export const createTimerState = <T extends Fn>(): TimerState<T> => ({
    lastArgs: undefined,
    lastResult: undefined,
    lastThis: undefined,
    timeoutId: undefined,
})

export function invokeTimer<T extends Fn>(state: TimerState<T>, fn: T) {
    const args = state.lastArgs!
    const thisArg = state.lastThis

    state.timeoutId = undefined
    state.lastArgs = undefined
    state.lastResult = fn.apply(thisArg, args)
}

export function flushTimer<T extends Fn>(state: TimerState<T>, invoke: () => void) {
    if (state.timeoutId !== undefined) {
        clearTimeout(state.timeoutId)
        invoke()
    }

    return state.lastResult
}
