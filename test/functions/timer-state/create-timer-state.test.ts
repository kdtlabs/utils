import { describe, expect, it } from 'bun:test'
import { createTimerState } from '../../../src/functions/timer-state'

describe('createTimerState', () => {
    it('returns state with all fields undefined', () => {
        const state = createTimerState()

        expect(state.lastArgs).toBeUndefined()
        expect(state.lastResult).toBeUndefined()
        expect(state.lastThis).toBeUndefined()
        expect(state.timeoutId).toBeUndefined()
    })

    it('returns a new object each call', () => {
        const a = createTimerState()
        const b = createTimerState()

        expect(a).not.toBe(b)
    })
})
