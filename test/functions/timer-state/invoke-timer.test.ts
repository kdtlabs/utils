import { describe, expect, it } from 'bun:test'
import { createTimerState, invokeTimer } from '@/functions/timer-state'

describe('invokeTimer', () => {
    it('calls fn and stores the return value', () => {
        const state = createTimerState<(a: number, b: number) => number>()

        state.lastArgs = [1, 2]
        state.lastThis = undefined
        invokeTimer(state, (a: number, b: number) => a + b)

        expect(state.lastResult).toBe(3)
    })

    it('clears lastArgs after invocation', () => {
        const state = createTimerState<() => void>()

        state.lastArgs = []
        invokeTimer(state, () => {})

        expect(state.lastArgs).toBeUndefined()
    })

    it('clears timeoutId after invocation', () => {
        const state = createTimerState<() => void>()

        state.lastArgs = []
        state.timeoutId = setTimeout(() => {}, 99_999)
        invokeTimer(state, () => {})

        expect(state.timeoutId).toBeUndefined()
    })

    it('stores the return value in lastResult', () => {
        const state = createTimerState<() => string>()

        state.lastArgs = []
        invokeTimer(state, () => 'hello')

        expect(state.lastResult).toBe('hello')
    })

    it('applies lastThis as this context via fn.apply', () => {
        const state = createTimerState<(a: number) => number>()
        const ctx = { multiplier: 3 }

        state.lastArgs = [5]
        state.lastThis = ctx

        invokeTimer(state, (a: number) => a)

        expect(state.lastThis).toEqual({ multiplier: 3 })
    })
})
