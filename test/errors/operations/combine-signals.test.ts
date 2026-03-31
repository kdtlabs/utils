import { describe, expect, it } from 'bun:test'
import { combineSignals } from '@/errors/operations'

describe('combineSignals', () => {
    it('returns a non-aborted signal when called with no arguments', () => {
        const signal = combineSignals()

        expect(signal).toBeInstanceOf(AbortSignal)
        expect(signal.aborted).toBe(false)
    })

    it('returns a non-aborted signal when all arguments are nullish', () => {
        const signal = combineSignals(null, undefined, null)

        expect(signal.aborted).toBe(false)
    })

    it('returns the same signal when given a single signal', () => {
        const controller = new AbortController()
        const signal = combineSignals(controller.signal)

        expect(signal).toBe(controller.signal)
    })

    it('returns the same signal when given a single signal with nullish values', () => {
        const controller = new AbortController()
        const signal = combineSignals(null, controller.signal, undefined)

        expect(signal).toBe(controller.signal)
    })

    it('combines multiple signals', () => {
        const c1 = new AbortController()
        const c2 = new AbortController()
        const signal = combineSignals(c1.signal, c2.signal)

        expect(signal.aborted).toBe(false)

        c1.abort()

        expect(signal.aborted).toBe(true)
    })

    it('is already aborted if any input signal is already aborted', () => {
        const c1 = new AbortController()
        const c2 = new AbortController()

        c1.abort('reason')

        const signal = combineSignals(c1.signal, c2.signal)

        expect(signal.aborted).toBe(true)
    })

    it('filters out nullish values when combining', () => {
        const c1 = new AbortController()
        const c2 = new AbortController()
        const signal = combineSignals(null, c1.signal, undefined, c2.signal)

        expect(signal.aborted).toBe(false)

        c2.abort()

        expect(signal.aborted).toBe(true)
    })
})
