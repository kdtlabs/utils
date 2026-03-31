import { describe, expect, it } from 'bun:test'
import { once } from '@/functions/once'

describe('once', () => {
    it('calls the function on first invocation', () => {
        let count = 0
        const fn = once(() => ++count)

        expect(fn()).toBe(1)
        expect(count).toBe(1)
    })

    it('returns cached result on subsequent calls', () => {
        let count = 0
        const fn = once(() => ++count)

        fn()

        expect(fn()).toBe(1)
        expect(fn()).toBe(1)
        expect(count).toBe(1)
    })

    it('passes arguments to the original function', () => {
        const fn = once((a: number, b: number) => a + b)

        expect(fn(2, 3)).toBe(5)
    })

    it('ignores arguments on subsequent calls', () => {
        const fn = once((a: number, b: number) => a + b)

        fn(2, 3)

        expect(fn(10, 20)).toBe(5)
    })

    it('throws normalized error when original function throws', () => {
        const fn = once(() => {
            throw new Error('raw string')
        })

        expect(() => fn()).toThrow(Error)
    })

    it('re-throws same normalized error on subsequent calls', () => {
        const fn = once(() => {
            throw new Error('boom')
        })

        expect(() => fn()).toThrow('boom')
        expect(() => fn()).toThrow('boom')
    })

    it('throws consistently normalized errors across calls', () => {
        const fn = once(() => {
            throw new Error('raw')
        })

        let firstError: unknown
        let secondError: unknown

        try {
            fn()
        } catch (error) {
            firstError = error
        }

        try {
            fn()
        } catch (error) {
            secondError = error
        }

        expect(firstError).toBeInstanceOf(Error)
        expect(secondError).toBeInstanceOf(Error)
        expect((firstError as Error).message).toBe((secondError as Error).message)
    })

    describe('reset', () => {
        it('allows the function to be called again after reset', () => {
            let count = 0
            const fn = once(() => ++count)

            fn()
            fn.reset()

            expect(fn()).toBe(2)
            expect(count).toBe(2)
        })

        it('clears cached error after reset', () => {
            let shouldThrow = true

            const fn = once(() => {
                if (shouldThrow) {
                    throw new Error('boom')
                }

                return 'ok'
            })

            expect(() => fn()).toThrow('boom')

            fn.reset()
            shouldThrow = false

            expect(fn()).toBe('ok')
        })
    })
})
