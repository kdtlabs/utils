import { describe, expect, it } from 'bun:test'
import { isAbortError } from '../../src/errors'
import { withRetry } from '../../src/promises/retry'

describe('withRetry', () => {
    it('returns result on first successful attempt', async () => {
        const result = await withRetry(() => 'ok', { delay: 0 })

        expect(result).toBe('ok')
    })

    it('retries and succeeds after failures', async () => {
        let attempts = 0

        const result = await withRetry(() => {
            attempts++

            if (attempts < 3) {
                throw new Error(`fail ${attempts}`)
            }

            return 'ok'
        }, { delay: 0, jitter: 0 })

        expect(result).toBe('ok')
        expect(attempts).toBe(3)
    })

    it('throws single error when only one attempt fails', async () => {
        const error = new Error('single')

        try {
            await withRetry(() => {
                throw error
            }, { delay: 0, maxAttempts: 1 })

            expect.unreachable('should have thrown')
        } catch (error_) {
            expect(error_).toBe(error)
        }
    })

    it('throws AggregateError when multiple attempts fail', async () => {
        try {
            await withRetry(() => {
                throw new Error('fail')
            }, { delay: 0, maxAttempts: 3 })

            expect.unreachable('should have thrown')
        } catch (error) {
            expect(error).toBeInstanceOf(AggregateError)
            expect((error as AggregateError).errors).toHaveLength(3)
        }
    })

    it('resolves with async function result', async () => {
        const result = await withRetry(async () => {
            await Promise.resolve()

            return 42
        }, { delay: 0 })

        expect(result).toBe(42)
    })

    it('handles sync return values (Awaitable)', async () => {
        const result = await withRetry(() => 'sync', { delay: 0 })

        expect(result).toBe('sync')
    })

    describe('maxAttempts', () => {
        it('defaults to 3 attempts', async () => {
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++
                    throw new Error('fail')
                }, { delay: 0 })
            } catch {
                // expected
            }

            expect(attempts).toBe(3)
        })

        it('respects custom maxAttempts', async () => {
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++
                    throw new Error('fail')
                }, { delay: 0, maxAttempts: 5 })
            } catch {
                // expected
            }

            expect(attempts).toBe(5)
        })

        it('returns on last attempt success with no retries left', async () => {
            let attempts = 0

            const result = await withRetry(() => {
                attempts++

                if (attempts < 3) {
                    throw new Error('fail')
                }

                return 'last'
            }, { delay: 0, maxAttempts: 3 })

            expect(result).toBe('last')
        })
    })

    describe('shouldRetry', () => {
        it('stops retrying when shouldRetry returns false', async () => {
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++
                    throw new Error('fail')
                }, { delay: 0, maxAttempts: 5, shouldRetry: () => false })

                expect.unreachable('should have thrown')
            } catch {
                // expected
            }

            expect(attempts).toBe(1)
        })

        it('receives error and context', async () => {
            const calls: Array<{ attempts: number, error: unknown, retriesLeft: number }> = []

            try {
                await withRetry(() => {
                    throw new Error('test')
                }, {
                    delay: 0,
                    maxAttempts: 3,
                    shouldRetry(error, context) {
                        calls.push({ attempts: context.attempts, error, retriesLeft: context.retriesLeft })

                        return true
                    },
                })
            } catch {
                // expected
            }

            expect(calls).toHaveLength(2)
            expect(calls[0]!.attempts).toBe(1)
            expect(calls[0]!.retriesLeft).toBe(2)
            expect(calls[1]!.attempts).toBe(2)
            expect(calls[1]!.retriesLeft).toBe(1)
        })

        it('supports async shouldRetry', async () => {
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++
                    throw new Error('fail')
                }, { delay: 0, maxAttempts: 5, shouldRetry: () => Promise.resolve(attempts < 3) })

                expect.unreachable('should have thrown')
            } catch {
                // expected
            }

            expect(attempts).toBe(3)
        })
    })

    describe('shouldRetryOnSuccess', () => {
        it('retries successful result when shouldRetryOnSuccess returns true', async () => {
            let attempts = 0

            const result = await withRetry(() => {
                attempts++

                return attempts
            }, {
                delay: 0,
                maxAttempts: 5,
                shouldRetryOnSuccess: (result_) => result_ < 3,
            })

            expect(result).toBe(3)
            expect(attempts).toBe(3)
        })

        it('returns immediately when shouldRetryOnSuccess returns false', async () => {
            let attempts = 0

            const result = await withRetry(() => {
                attempts++

                return 'done'
            }, {
                delay: 0,
                shouldRetryOnSuccess: () => false,
            })

            expect(result).toBe('done')
            expect(attempts).toBe(1)
        })

        it('throws when shouldRetryOnSuccess returns true on last attempt', async () => {
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    return attempts
                }, {
                    delay: 0,
                    maxAttempts: 3,
                    shouldRetryOnSuccess: () => true,
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBeInstanceOf(AggregateError)
                expect((error as AggregateError).errors).toHaveLength(0)
            }

            expect(attempts).toBe(3)
        })
    })

    describe('onFailedAttempt', () => {
        it('is called immediately on failure before waiting', async () => {
            const order: string[] = []

            try {
                await withRetry(() => {
                    throw new Error('fail')
                }, {
                    delay: 0,
                    maxAttempts: 2,
                    onBeforeWaitForNextAttempt() {
                        order.push('wait')
                    },
                    onFailedAttempt() {
                        order.push('failed')
                    },
                })
            } catch {
                // expected
            }

            expect(order).toEqual(['failed', 'wait'])
        })

        it('receives error and context', async () => {
            const errors: unknown[] = []
            const contexts: Array<{ attempts: number, retriesLeft: number }> = []

            try {
                await withRetry(() => {
                    throw new Error('test')
                }, {
                    delay: 0,
                    maxAttempts: 3,
                    onFailedAttempt(error, context) {
                        errors.push(error)
                        contexts.push({ attempts: context.attempts, retriesLeft: context.retriesLeft })
                    },
                })
            } catch {
                // expected
            }

            expect(errors).toHaveLength(2)
            expect(contexts[0]!.attempts).toBe(1)
            expect(contexts[0]!.retriesLeft).toBe(2)
        })
    })

    describe('onSuccessAttempt', () => {
        it('is called after successful retry-on-success', async () => {
            const results: number[] = []
            let attempts = 0

            await withRetry(() => {
                attempts++

                return attempts
            }, {
                delay: 0,
                maxAttempts: 5,
                onSuccessAttempt(response) {
                    results.push(response)
                },
                shouldRetryOnSuccess: (r) => r < 3,
            })

            expect(results).toEqual([1, 2])
        })
    })

    describe('onBeforeWaitForNextAttempt', () => {
        it('receives computed delay and context', async () => {
            const delays: number[] = []
            const contexts: Array<{ attempts: number }> = []

            try {
                await withRetry(() => {
                    throw new Error('fail')
                }, {
                    delay: 100,
                    jitter: 0,
                    maxAttempts: 3,
                    onBeforeWaitForNextAttempt(delay, context) {
                        delays.push(delay)
                        contexts.push({ attempts: context.attempts })
                    },
                })
            } catch {
                // expected
            }

            expect(delays).toHaveLength(2)
            expect(delays[0]).toBe(100)
            expect(delays[1]).toBe(200)
            expect(contexts[0]!.attempts).toBe(1)
        })
    })

    describe('abort signal', () => {
        it('throws immediately when signal is already aborted', async () => {
            const controller = new AbortController()
            controller.abort()

            try {
                await withRetry(() => 'ok', { signal: controller.signal })
                expect.unreachable('should have thrown')
            } catch (error) {
                expect(isAbortError(error)).toBeTrue()
            }
        })

        it('throws abort error when signal aborts during fn execution', async () => {
            const controller = new AbortController()

            try {
                await withRetry(async () => {
                    controller.abort()
                    await new Promise((resolve) => setTimeout(resolve, 10))

                    return 'ok'
                }, { delay: 0, signal: controller.signal })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(isAbortError(error)).toBeTrue()
            }
        })

        it('does not retry abort errors', async () => {
            const controller = new AbortController()
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    if (attempts === 1) {
                        controller.abort()
                    }

                    return new Promise((resolve) => setTimeout(resolve, 10))
                }, { delay: 0, maxAttempts: 5, signal: controller.signal })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(isAbortError(error)).toBeTrue()
            }

            expect(attempts).toBe(1)
        })

        it('passes signal to fn', async () => {
            const controller = new AbortController()
            let receivedSignal: AbortSignal | undefined

            await withRetry((signal) => {
                receivedSignal = signal

                return 'ok'
            }, { delay: 0, signal: controller.signal })

            expect(receivedSignal).toBe(controller.signal)
        })

        it('provides signal in context', async () => {
            const controller = new AbortController()
            let contextSignal: AbortSignal | undefined

            try {
                await withRetry(() => {
                    throw new Error('fail')
                }, {
                    delay: 0,
                    maxAttempts: 2,
                    onFailedAttempt(_, context) {
                        contextSignal = context.signal
                    },
                    signal: controller.signal,
                })
            } catch {
                // expected
            }

            expect(contextSignal).toBe(controller.signal)
        })

        it('throws when signal aborts between attempts during sleep', async () => {
            const controller = new AbortController()
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    if (attempts === 1) {
                        throw new Error('fail')
                    }

                    return 'ok'
                }, {
                    delay: 5000,
                    maxAttempts: 5,
                    onFailedAttempt() {
                        controller.abort()
                    },
                    signal: controller.signal,
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(isAbortError(error)).toBeTrue()
            }
        })
    })

    describe('edge cases', () => {
        it('works with maxAttempts of 1', async () => {
            const result = await withRetry(() => 'ok', { delay: 0, maxAttempts: 1 })

            expect(result).toBe('ok')
        })

        it('preserves error types in aggregate', async () => {
            let count = 0

            try {
                await withRetry(() => {
                    count++

                    if (count === 1) {
                        throw new TypeError('type')
                    }

                    throw new RangeError('range')
                }, { delay: 0, maxAttempts: 2 })
            } catch (error) {
                expect(error).toBeInstanceOf(AggregateError)

                const agg = error as AggregateError

                expect(agg.errors[0]).toBeInstanceOf(TypeError)
                expect(agg.errors[1]).toBeInstanceOf(RangeError)
            }
        })

        it('works with default options', async () => {
            const result = await withRetry(() => 'default')

            expect(result).toBe('default')
        })

        it('handles fn returning a promise that rejects', async () => {
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    return Promise.reject(new Error('rejected'))
                }, { delay: 0, maxAttempts: 2 })
            } catch {
                // expected
            }

            expect(attempts).toBe(2)
        })

        it('rethrows non-abort errors from sleep during retry wait', async () => {
            const controller = new AbortController()
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    if (attempts < 2) {
                        throw new Error('fail')
                    }

                    return 'ok'
                }, {
                    delay: 1,
                    maxAttempts: 3,
                    onFailedAttempt() {
                        controller.abort(new Error('custom non-abort'))
                    },
                    signal: controller.signal,
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
            }
        })

        it('throws after exhausting all success-retry attempts', async () => {
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    return attempts
                }, {
                    delay: 0,
                    maxAttempts: 3,
                    shouldRetryOnSuccess: () => true,
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBeInstanceOf(AggregateError)
                expect((error as AggregateError).errors).toHaveLength(0)
            }

            expect(attempts).toBe(3)
        })
    })

    describe('callback error propagation', () => {
        it('propagates error thrown by shouldRetry', async () => {
            const callbackError = new Error('shouldRetry exploded')

            try {
                await withRetry(() => {
                    throw new Error('fail')
                }, {
                    delay: 0,
                    maxAttempts: 3,
                    shouldRetry() {
                        throw callbackError
                    },
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBe(callbackError)
            }
        })

        it('propagates error thrown by onFailedAttempt', async () => {
            const callbackError = new Error('onFailedAttempt exploded')

            try {
                await withRetry(() => {
                    throw new Error('fail')
                }, {
                    delay: 0,
                    maxAttempts: 3,
                    onFailedAttempt() {
                        throw callbackError
                    },
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBe(callbackError)
            }
        })

        it('propagates error thrown by onBeforeWaitForNextAttempt', async () => {
            const callbackError = new Error('onBeforeWait exploded')

            try {
                await withRetry(() => {
                    throw new Error('fail')
                }, {
                    delay: 0,
                    maxAttempts: 3,
                    onBeforeWaitForNextAttempt() {
                        throw callbackError
                    },
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBe(callbackError)
            }
        })

        it('propagates error thrown by shouldRetryOnSuccess', async () => {
            const callbackError = new Error('shouldRetryOnSuccess exploded')

            try {
                await withRetry(() => 'ok', {
                    delay: 0,
                    maxAttempts: 3,
                    shouldRetryOnSuccess() {
                        throw callbackError
                    },
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBe(callbackError)
            }
        })

        it('propagates error thrown by onSuccessAttempt', async () => {
            const callbackError = new Error('onSuccessAttempt exploded')

            try {
                await withRetry(() => 'ok', {
                    delay: 0,
                    maxAttempts: 3,
                    onSuccessAttempt() {
                        throw callbackError
                    },
                    shouldRetryOnSuccess: () => true,
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBe(callbackError)
            }
        })
    })

    describe('shouldRetry and shouldRetryOnSuccess combined', () => {
        it('uses shouldRetry on failures then shouldRetryOnSuccess on success', async () => {
            let attempts = 0

            const shouldRetryCalls: number[] = []
            const shouldRetryOnSuccessCalls: number[] = []

            const result = await withRetry(() => {
                attempts++

                if (attempts <= 2) {
                    throw new Error(`fail ${attempts}`)
                }

                return attempts
            }, {
                delay: 0,
                maxAttempts: 10,
                shouldRetry(_error, context) {
                    shouldRetryCalls.push(context.attempts)

                    return true
                },
                shouldRetryOnSuccess(result_, context) {
                    shouldRetryOnSuccessCalls.push(context.attempts)

                    return result_ < 5
                },
            })

            expect(result).toBe(5)
            expect(shouldRetryCalls).toEqual([1, 2])
            expect(shouldRetryOnSuccessCalls).toEqual([3, 4, 5])
        })

        it('stops on shouldRetry false even when shouldRetryOnSuccess is provided', async () => {
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++
                    throw new Error('fail')
                }, {
                    delay: 0,
                    maxAttempts: 10,
                    shouldRetry: () => false,
                    shouldRetryOnSuccess: () => true,
                })

                expect.unreachable('should have thrown')
            } catch {
                // expected
            }

            expect(attempts).toBe(1)
        })
    })

    describe('onSuccessAttempt ordering', () => {
        it('calls onSuccessAttempt before onBeforeWaitForNextAttempt on success retry', async () => {
            const order: string[] = []
            let attempts = 0

            await withRetry(() => {
                attempts++

                return attempts
            }, {
                delay: 0,
                maxAttempts: 3,
                onBeforeWaitForNextAttempt() {
                    order.push('wait')
                },
                onSuccessAttempt() {
                    order.push('success')
                },
                shouldRetryOnSuccess: (r) => r < 2,
            })

            expect(order).toEqual(['success', 'wait'])
        })

        it('does not call onSuccessAttempt when shouldRetryOnSuccess returns false', async () => {
            let called = false

            await withRetry(() => 'ok', {
                delay: 0,
                maxAttempts: 3,
                onSuccessAttempt() {
                    called = true
                },
                shouldRetryOnSuccess: () => false,
            })

            expect(called).toBeFalse()
        })

        it('does not call onSuccessAttempt on the last attempt even with shouldRetryOnSuccess true', async () => {
            const successCalls: number[] = []
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    return attempts
                }, {
                    delay: 0,
                    maxAttempts: 3,
                    onSuccessAttempt(response) {
                        successCalls.push(response)
                    },
                    shouldRetryOnSuccess: () => true,
                })
            } catch {
                // expected — throws on last attempt when shouldRetryOnSuccess is true
            }

            expect(successCalls).toEqual([1, 2])
        })
    })

    describe('maxAttempts edge values', () => {
        it('throws RangeError when maxAttempts is 0', async () => {
            try {
                await withRetry(() => 'ok', { delay: 0, maxAttempts: 0 })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBeInstanceOf(RangeError)
            }
        })

        it('throws RangeError when maxAttempts is negative', async () => {
            try {
                await withRetry(() => 'ok', { delay: 0, maxAttempts: -1 })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(error).toBeInstanceOf(RangeError)
            }
        })

        it('does not call fn when maxAttempts is 0', async () => {
            let called = false

            try {
                await withRetry(() => {
                    called = true

                    return 'ok'
                }, { delay: 0, maxAttempts: 0 })
            } catch {
                // expected
            }

            expect(called).toBeFalse()
        })
    })

    describe('abort signal during callbacks', () => {
        it('throws abort error when signal aborts during shouldRetry', async () => {
            const controller = new AbortController()
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++
                    throw new Error('fail')
                }, {
                    delay: 0,
                    maxAttempts: 5,
                    async shouldRetry() {
                        controller.abort()
                        await new Promise((resolve) => setTimeout(resolve, 10))

                        return true
                    },
                    signal: controller.signal,
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(isAbortError(error)).toBeTrue()
            }

            expect(attempts).toBe(1)
        })

        it('aborts before second attempt when signal fires during onFailedAttempt', async () => {
            const controller = new AbortController()
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++
                    throw new Error('fail')
                }, {
                    delay: 0,
                    maxAttempts: 5,
                    onFailedAttempt() {
                        controller.abort()
                    },
                    signal: controller.signal,
                })

                expect.unreachable('should have thrown')
            } catch (error) {
                expect(isAbortError(error)).toBeTrue()
            }

            expect(attempts).toBe(1)
        })
    })

    describe('mixed failure and success-retry flow', () => {
        it('collects errors only from failures, not from success retries', async () => {
            let attempts = 0

            const result = await withRetry(() => {
                attempts++

                if (attempts === 1) {
                    throw new Error('first fail')
                }

                return attempts
            }, {
                delay: 0,
                maxAttempts: 5,
                shouldRetryOnSuccess: (r) => r < 4,
            })

            expect(result).toBe(4)
            expect(attempts).toBe(4)
        })

        it('calls onFailedAttempt for failures and onSuccessAttempt for success retries', async () => {
            const failedCalls: number[] = []
            const successCalls: number[] = []

            let attempts = 0

            await withRetry(() => {
                attempts++

                if (attempts <= 2) {
                    throw new Error('fail')
                }

                return attempts
            }, {
                delay: 0,
                maxAttempts: 10,
                onFailedAttempt(_error, context) {
                    failedCalls.push(context.attempts)
                },
                onSuccessAttempt(response) {
                    successCalls.push(response)
                },
                shouldRetryOnSuccess: (r) => r < 5,
            })

            expect(failedCalls).toEqual([1, 2])
            expect(successCalls).toEqual([3, 4])
        })
    })

    describe('context correctness', () => {
        it('provides correct retriesLeft in shouldRetryOnSuccess', async () => {
            const contexts: Array<{ attempts: number, retriesLeft: number }> = []
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    return attempts
                }, {
                    delay: 0,
                    maxAttempts: 4,
                    shouldRetryOnSuccess(_result, context) {
                        contexts.push({ attempts: context.attempts, retriesLeft: context.retriesLeft })

                        return true
                    },
                })
            } catch {
                // expected — throws on last attempt
            }

            expect(contexts).toEqual([
                { attempts: 1, retriesLeft: 3 },
                { attempts: 2, retriesLeft: 2 },
                { attempts: 3, retriesLeft: 1 },
                { attempts: 4, retriesLeft: 0 },
            ])
        })

        it('provides correct context in onSuccessAttempt', async () => {
            const contexts: Array<{ attempts: number, retriesLeft: number }> = []
            let attempts = 0

            try {
                await withRetry(() => {
                    attempts++

                    return attempts
                }, {
                    delay: 0,
                    maxAttempts: 4,
                    onSuccessAttempt(_response, context) {
                        contexts.push({ attempts: context.attempts, retriesLeft: context.retriesLeft })
                    },
                    shouldRetryOnSuccess: () => true,
                })
            } catch {
                // expected — throws on last attempt
            }

            expect(contexts).toEqual([
                { attempts: 1, retriesLeft: 3 },
                { attempts: 2, retriesLeft: 2 },
                { attempts: 3, retriesLeft: 1 },
            ])
        })
    })
})
