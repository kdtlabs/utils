import { describe, expect, it } from 'bun:test'
import { poll } from '@/promises/poll'

describe('poll', () => {
    describe('argument overloads', () => {
        it('accepts (fn, options) signature', async () => {
            let called = false

            const stop = poll(() => {
                called = true
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 20))
            await stop()

            expect(called).toBeTrue()
        })

        it('accepts (options, fn) signature', async () => {
            let called = false

            const stop = poll({ delay: 0 }, () => {
                called = true
            })

            await new Promise((resolve) => setTimeout(resolve, 20))
            await stop()

            expect(called).toBeTrue()
        })

        it('throws when first arg is not function or object', () => {
            expect(() => poll(42 as never, () => {})).toThrow()
        })

        it('throws when second arg is not function when first is object', () => {
            expect(() => poll({} as never, {} as never)).toThrow()
        })
    })

    describe('immediately option', () => {
        it('starts immediately by default', async () => {
            let count = 0

            const stop = poll(() => {
                count++
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 30))
            await stop()

            expect(count).toBeGreaterThan(0)
        })

        it('delays first execution when immediately is false', async () => {
            let count = 0

            const stop = poll(() => {
                count++
            }, { delay: 50, immediately: false })

            await new Promise((resolve) => setTimeout(resolve, 10))
            const countBeforeDelay = count
            await stop()

            expect(countBeforeDelay).toBe(0)
        })
    })

    describe('repeated execution', () => {
        it('runs fn multiple times', async () => {
            let count = 0

            const stop = poll(() => {
                count++
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 50))
            await stop()

            expect(count).toBeGreaterThan(1)
        })

        it('waits for delay between executions', async () => {
            const timestamps: number[] = []

            const stop = poll(() => {
                timestamps.push(Date.now())
            }, { delay: 30 })

            await new Promise((resolve) => setTimeout(resolve, 120))
            await stop()

            if (timestamps.length >= 2) {
                const gap = timestamps[1]! - timestamps[0]!

                expect(gap).toBeGreaterThanOrEqual(25)
            }
        })
    })

    describe('stop behavior', () => {
        it('returns a function', () => {
            const stop = poll(() => {}, { delay: 0 })

            expect(typeof stop).toBe('function')
            stop()
        })

        it('stops further executions', async () => {
            let count = 0

            const stop = poll(() => {
                count++
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 20))
            await stop()

            const countAfterStop = count

            await new Promise((resolve) => setTimeout(resolve, 30))

            expect(count).toBe(countAfterStop)
        })

        it('returns a promise that resolves when in-flight task completes', async () => {
            let taskEntered = false

            const stop = poll(async () => {
                taskEntered = true
                await new Promise((resolve) => setTimeout(resolve, 10))
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 5))
            expect(taskEntered).toBeTrue()

            const stopPromise = stop()

            expect(stopPromise).toBeInstanceOf(Promise)
            await stopPromise
        })

        it('returns resolved promise when no task is in-flight', async () => {
            const stop = poll(() => {}, { delay: 1000, immediately: false })
            const result = await stop()

            expect(result).toBeUndefined()
        })

        it('is idempotent', async () => {
            const stop = poll(() => {}, { delay: 0 })

            await stop()
            await stop()
        })
    })

    describe('signal behavior', () => {
        it('passes signal to fn', async () => {
            let receivedSignal: AbortSignal | undefined

            const stop = poll((signal) => {
                receivedSignal = signal
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 10))
            await stop()

            expect(receivedSignal).toBeDefined()
            expect(receivedSignal!.aborted).toBeTrue()
        })
    })

    describe('error handling', () => {
        it('stops on error by default', async () => {
            let count = 0

            const stop = poll(() => {
                count++
                throw new Error('fail')
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 30))
            await stop()

            expect(count).toBe(1)
        })

        it('calls onError when fn throws', async () => {
            const errors: unknown[] = []

            const stop = poll(() => {
                throw new Error('test')
            }, {
                delay: 0,
                onError(error) {
                    errors.push(error)
                },
            })

            await new Promise((resolve) => setTimeout(resolve, 20))
            await stop()

            expect(errors).toHaveLength(1)
            expect((errors[0] as Error).message).toBe('test')
        })

        it('continues polling when stopOnError is false', async () => {
            let count = 0

            const stop = poll(() => {
                count++

                if (count <= 2) {
                    throw new Error('fail')
                }
            }, { delay: 0, stopOnError: false })

            await new Promise((resolve) => setTimeout(resolve, 50))
            await stop()

            expect(count).toBeGreaterThan(2)
        })

        it('calls onError for each error when stopOnError is false', async () => {
            const errors: unknown[] = []
            let count = 0

            const stop = poll(() => {
                count++
                throw new Error(`fail ${count}`)
            }, {
                delay: 0,
                onError(error) {
                    errors.push(error)
                },
                stopOnError: false,
            })

            await new Promise((resolve) => setTimeout(resolve, 50))
            await stop()

            expect(errors.length).toBeGreaterThan(1)
        })

        it('handles async fn rejection', async () => {
            const errors: unknown[] = []

            const stop = poll(() => Promise.reject(new Error('async fail')), {
                delay: 0,
                onError(error) {
                    errors.push(error)
                },
            })

            await new Promise((resolve) => setTimeout(resolve, 20))
            await stop()

            expect(errors).toHaveLength(1)
        })

        it('silently handles abort error when stopped', async () => {
            let errorCaught = false

            const stop = poll(async (signal) => {
                await new Promise((_resolve, reject) => {
                    signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
                })
            }, {
                delay: 0,
                onError() {
                    errorCaught = true
                },
            })

            await new Promise((resolve) => setTimeout(resolve, 10))
            await stop()

            expect(errorCaught).toBeFalse()
        })
    })

    describe('edge cases', () => {
        it('handles fn returning non-promise values', async () => {
            let count = 0

            const stop = poll(() => {
                count++
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 20))
            await stop()

            expect(count).toBeGreaterThan(0)
        })

        it('handles delay of 0', async () => {
            let count = 0

            const stop = poll(() => {
                count++
            }, { delay: 0 })

            await new Promise((resolve) => setTimeout(resolve, 30))
            await stop()

            expect(count).toBeGreaterThan(1)
        })

        it('uses default options when not provided', async () => {
            let count = 0

            const stop = poll(() => {
                count++
            })

            await new Promise((resolve) => setTimeout(resolve, 20))
            await stop()

            expect(count).toBeGreaterThan(0)
        })
    })
})
