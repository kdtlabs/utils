import { describe, expect, it } from 'bun:test'
import { pPipe } from '../../src/promises/pipe'

describe('pPipe', () => {
    it('returns undefined when called with no arguments', async () => {
        const result = await pPipe()

        expect(result).toBeUndefined()
    })

    it('returns a Promise even with no arguments', () => {
        const result = pPipe()

        expect(result).toBeInstanceOf(Promise)
    })

    it('calls a single sync function and returns its result', async () => {
        const result = await pPipe(() => 42)

        expect(result).toBe(42)
    })

    it('calls a single async function and returns its result', async () => {
        const result = await pPipe(() => Promise.resolve('hello'))

        expect(result).toBe('hello')
    })

    it('pipes result through two sync functions', async () => {
        const result = await pPipe(
            () => 5,
            (n: number) => n * 3,
        )

        expect(result).toBe(15)
    })

    it('pipes result through two async functions', async () => {
        const result = await pPipe(
            () => Promise.resolve(10),
            (n: number) => Promise.resolve(n + 5),
        )

        expect(result).toBe(15)
    })

    it('pipes through a mix of sync and async functions', async () => {
        const result = await pPipe(
            () => 1,
            (n: number) => Promise.resolve(n + 1),
            (n: number) => n * 10,
            (n: number) => Promise.resolve(`value:${n}`),
        )

        expect(result).toBe('value:20')
    })

    it('threads the correct value through each step', async () => {
        const calls: unknown[] = []

        await pPipe(
            () => 'a',
            (v: string) => {
                calls.push(v)

                return 'b'
            },
            (v: string) => {
                calls.push(v)

                return 'c'
            },
            (v: string) => {
                calls.push(v)

                return 'd'
            },
        )

        expect(calls).toEqual(['a', 'b', 'c'])
    })

    it('executes functions in sequential order', async () => {
        const order: number[] = []

        await pPipe(
            () => {
                order.push(1)

                return 'x'
            },
            () => {
                order.push(2)

                return 'y'
            },
            () => {
                order.push(3)

                return 'z'
            },
        )

        expect(order).toEqual([1, 2, 3])
    })

    it('awaits each async step before calling the next', async () => {
        const order: string[] = []

        await pPipe(
            async () => {
                await Promise.resolve()
                order.push('first')

                return 1
            },
            async (n: number) => {
                await Promise.resolve()
                order.push('second')

                return n + 1
            },
        )

        expect(order).toEqual(['first', 'second'])
    })

    it('handles a function that returns a non-promise thenable', async () => {
        // eslint-disable-next-line unicorn/no-thenable
        const thenable = { then: (resolve: (v: number) => void) => resolve(99) }

        const result = await pPipe(
            () => thenable,
            (n: number) => n + 1,
        )

        expect(result).toBe(100)
    })

    it('propagates rejection from the first function', async () => {
        const promise = pPipe(
            () => Promise.reject(new Error('first failed')),
            (n: unknown) => n,
        )

        try {
            await promise
            expect.unreachable('should have rejected')
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect((error as Error).message).toBe('first failed')
        }
    })

    it('propagates rejection from a middle function', async () => {
        const promise = pPipe(
            () => 'start',
            () => Promise.reject(new Error('middle failed')),
            (n: unknown) => n,
        )

        try {
            await promise
            expect.unreachable('should have rejected')
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect((error as Error).message).toBe('middle failed')
        }
    })

    it('propagates rejection from the last function', async () => {
        const promise = pPipe(
            () => 1,
            (n: number) => n + 1,
            () => Promise.reject(new Error('last failed')),
        )

        try {
            await promise
            expect.unreachable('should have rejected')
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect((error as Error).message).toBe('last failed')
        }
    })

    it('stops execution after a rejection', async () => {
        const calls: string[] = []

        const promise = pPipe(
            () => {
                calls.push('first')

                return 1
            },
            () => {
                calls.push('second')
                throw new Error('boom')
            },
            () => {
                calls.push('third')

                return 3
            },
        )

        try {
            await promise
            expect.unreachable('should have rejected')
        } catch (error) {
            expect((error as Error).message).toBe('boom')
        }

        expect(calls).toEqual(['first', 'second'])
    })

    it('propagates a synchronous throw from the first function', async () => {
        const promise = pPipe(
            () => {
                throw new Error('sync throw')
            },
        )

        try {
            await promise
            expect.unreachable('should have rejected')
        } catch (error) {
            expect((error as Error).message).toBe('sync throw')
        }
    })

    it('propagates a synchronous throw from a middle function', async () => {
        const promise = pPipe(
            () => 'ok',
            () => {
                throw new TypeError('type error in middle')
            },
            (n: unknown) => n,
        )

        try {
            await promise
            expect.unreachable('should have rejected')
        } catch (error) {
            expect((error as Error).message).toBe('type error in middle')
        }
    })

    it('preserves the error type on throw', async () => {
        const promise = pPipe(
            () => {
                throw new RangeError('out of range')
            },
        )

        try {
            await promise
            expect.unreachable('should have thrown')
        } catch (error) {
            expect(error).toBeInstanceOf(RangeError)
        }
    })

    it('handles undefined returned from a function', async () => {
        const result = await pPipe(
            () => {},
            (v: undefined) => v,
        )

        expect(result).toBeUndefined()
    })

    it('handles null returned from a function', async () => {
        const result = await pPipe(
            () => null,
            (v: null) => v,
        )

        expect(result).toBeNull()
    })

    it('handles zero returned from a function', async () => {
        const result = await pPipe(
            () => 0,
            (n: number) => n,
        )

        expect(result).toBe(0)
    })

    it('handles empty string returned from a function', async () => {
        const result = await pPipe(
            () => '',
            (s: string) => s,
        )

        expect(result).toBe('')
    })

    it('handles false returned from a function', async () => {
        const result = await pPipe(
            () => false,
            (b: boolean) => b,
        )

        expect(result).toBe(false)
    })

    it('returns the result of the last function in the chain', async () => {
        const result = await pPipe(
            () => 'a',
            () => 'b',
            () => 'c',
            () => 'final',
        )

        expect(result).toBe('final')
    })

    it('can transform types through the pipeline', async () => {
        const result = await pPipe(
            () => 42,
            String,
            (s: string) => [s],
            (arr: string[]) => ({ values: arr }),
        )

        expect(result).toEqual({ values: ['42'] })
    })
})
