import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'
import { createTimerState, flushTimer } from '@/functions/timer-state'

beforeEach(() => {
    jest.useFakeTimers()
})

afterEach(() => {
    jest.useRealTimers()
})

describe('flushTimer', () => {
    it('executes invoke callback when timer is pending', () => {
        const state = createTimerState<() => number>()
        let invoked = false

        state.timeoutId = setTimeout(() => {}, 99_999)

        flushTimer(state, () => {
            invoked = true
        })

        expect(invoked).toBe(true)
    })

    it('clears the pending timeout', () => {
        const state = createTimerState<() => void>()
        let timerFired = false

        state.timeoutId = setTimeout(() => {
            timerFired = true
        }, 100)

        flushTimer(state, () => {})
        jest.advanceTimersByTime(200)

        expect(timerFired).toBe(false)
    })

    it('returns lastResult after invoke', () => {
        const state = createTimerState<() => number>()

        state.timeoutId = setTimeout(() => {}, 99_999)

        const result = flushTimer(state, () => {
            state.lastResult = 42
        })

        expect(result).toBe(42)
    })

    it('is a no-op when no timer is pending', () => {
        const state = createTimerState<() => void>()
        let invoked = false

        flushTimer(state, () => {
            invoked = true
        })

        expect(invoked).toBe(false)
    })

    it('returns lastResult when no timer is pending', () => {
        const state = createTimerState<() => string>()

        state.lastResult = 'previous'

        const result = flushTimer(state, () => {})

        expect(result).toBe('previous')
    })

    it('returns undefined when never invoked and no timer pending', () => {
        const state = createTimerState<() => number>()

        const result = flushTimer(state, () => {})

        expect(result).toBeUndefined()
    })
})
