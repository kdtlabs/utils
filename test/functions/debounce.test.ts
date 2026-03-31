import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'
import { debounce } from '@/functions/debounce'

beforeEach(() => {
    jest.useFakeTimers()
})

afterEach(() => {
    jest.useRealTimers()
})

describe('debounce', () => {
    it('does not call fn immediately', () => {
        let count = 0
        const debounced = debounce(() => ++count, 100)

        debounced()

        expect(count).toBe(0)
    })

    it('calls fn after wait period', () => {
        let count = 0
        const debounced = debounce(() => ++count, 100)

        debounced()
        jest.advanceTimersByTime(100)

        expect(count).toBe(1)
    })

    it('resets timer on subsequent calls', () => {
        let count = 0
        const debounced = debounce(() => ++count, 100)

        debounced()
        jest.advanceTimersByTime(50)
        debounced()
        jest.advanceTimersByTime(50)

        expect(count).toBe(0)

        jest.advanceTimersByTime(50)

        expect(count).toBe(1)
    })

    it('passes most recent arguments to fn', () => {
        let captured: number | undefined

        const debounced = debounce((n: number) => {
            captured = n
        }, 100)

        debounced(1)
        debounced(2)
        debounced(3)
        jest.advanceTimersByTime(100)

        expect(captured).toBe(3)
    })

    it('preserves this context', () => {
        const captured: unknown[] = []

        const debounced = debounce(function (this: unknown) {
            captured.push(this)
        }, 100)

        const ctx = { name: 'test' }

        debounced.call(ctx)
        jest.advanceTimersByTime(100)

        expect(captured[0]).toBe(ctx)
    })

    describe('cancel', () => {
        it('prevents pending call from executing', () => {
            let count = 0
            const debounced = debounce(() => ++count, 100)

            debounced()
            debounced.cancel()
            jest.advanceTimersByTime(100)

            expect(count).toBe(0)
        })

        it('is a no-op when nothing is pending', () => {
            const debounced = debounce(() => {}, 100)

            expect(() => debounced.cancel()).not.toThrow()
        })
    })

    describe('flush', () => {
        it('executes pending call immediately', () => {
            let count = 0
            const debounced = debounce(() => ++count, 100)

            debounced()

            expect(debounced.flush()).toBe(1)
            expect(count).toBe(1)
        })

        it('returns last result when nothing is pending', () => {
            const debounced = debounce(() => 42, 100)

            debounced()
            jest.advanceTimersByTime(100)

            expect(debounced.flush()).toBe(42)
        })

        it('returns undefined when never called', () => {
            const debounced = debounce(() => 42, 100)

            expect(debounced.flush()).toBeUndefined()
        })

        it('clears the timer after flush', () => {
            let count = 0
            const debounced = debounce(() => ++count, 100)

            debounced()
            debounced.flush()
            jest.advanceTimersByTime(100)

            expect(count).toBe(1)
        })
    })
})
