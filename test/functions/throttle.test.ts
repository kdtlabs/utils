import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'
import { throttle } from '../../src/functions/throttle'

beforeEach(() => {
    jest.useFakeTimers()
})

afterEach(() => {
    jest.useRealTimers()
})

describe('throttle', () => {
    it('executes immediately on first call', () => {
        let count = 0
        const throttled = throttle(() => ++count, 100)

        throttled()

        expect(count).toBe(1)
    })

    it('does not execute again within wait period', () => {
        let count = 0
        const throttled = throttle(() => ++count, 100)

        throttled()
        throttled()
        throttled()

        expect(count).toBe(1)
    })

    it('executes trailing call after wait period', () => {
        let count = 0
        const throttled = throttle(() => ++count, 100)

        throttled()
        throttled()
        jest.advanceTimersByTime(100)

        expect(count).toBe(2)
    })

    it('single call does not produce trailing call', () => {
        let count = 0
        const throttled = throttle(() => ++count, 100)

        throttled()
        jest.advanceTimersByTime(100)

        expect(count).toBe(1)
    })

    it('uses most recent arguments for trailing call', () => {
        const calls: number[] = []

        const throttled = throttle((n: number) => {
            calls.push(n)
        }, 100)

        throttled(1)
        throttled(2)
        throttled(3)
        jest.advanceTimersByTime(100)

        expect(calls).toEqual([1, 3])
    })

    it('allows new leading call after wait period expires', () => {
        let count = 0
        const throttled = throttle(() => ++count, 100)

        throttled()
        jest.advanceTimersByTime(100)
        throttled()

        expect(count).toBe(2)
    })

    it('clears stale trailing timer when invoked after window expires', () => {
        let count = 0
        const throttled = throttle(() => ++count, 100)

        throttled()
        jest.advanceTimersByTime(10)
        throttled()
        jest.setSystemTime(Date.now() + 100)
        throttled()

        expect(count).toBe(2)
    })

    it('preserves this context', () => {
        const captured: unknown[] = []

        const throttled = throttle(function (this: unknown) {
            captured.push(this)
        }, 100)

        const ctx = { name: 'test' }

        throttled.call(ctx)

        expect(captured[0]).toBe(ctx)
    })

    describe('cancel', () => {
        it('prevents pending trailing call', () => {
            let count = 0
            const throttled = throttle(() => ++count, 100)

            throttled()
            throttled()
            throttled.cancel()
            jest.advanceTimersByTime(100)

            expect(count).toBe(1)
        })

        it('resets throttle window so next call is leading', () => {
            let count = 0
            const throttled = throttle(() => ++count, 100)

            throttled()
            throttled.cancel()
            throttled()

            expect(count).toBe(2)
        })
    })

    describe('flush', () => {
        it('executes pending trailing call immediately', () => {
            let count = 0
            const throttled = throttle(() => ++count, 100)

            throttled()
            throttled()

            expect(throttled.flush()).toBe(2)
            expect(count).toBe(2)
        })

        it('returns last result when nothing is pending', () => {
            const throttled = throttle(() => 42, 100)

            throttled()

            expect(throttled.flush()).toBe(42)
        })

        it('returns undefined when never called', () => {
            const throttled = throttle(() => 42, 100)

            expect(throttled.flush()).toBeUndefined()
        })

        it('clears the timer after flush', () => {
            let count = 0
            const throttled = throttle(() => ++count, 100)

            throttled()
            throttled()
            throttled.flush()
            jest.advanceTimersByTime(100)

            expect(count).toBe(2)
        })
    })
})
