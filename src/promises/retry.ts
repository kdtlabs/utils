import type { Awaitable } from './types'
import { isAbortError } from '@/errors'
import { clamp } from '@/numbers'
import { abortable } from './abortable'
import { sleep } from './timers'

export interface GetRetryDelayOptions {
    backoff?: number
    delay?: number
    jitter?: number
    maxDelay?: number
}

export function getRetryDelay(attempts: number, { backoff = 2, delay = 1000, jitter = 0.01, maxDelay = 10_000 }: GetRetryDelayOptions = {}) {
    const exponentialDelay = delay * backoff ** (attempts - 1)
    const clampedDelay = clamp(exponentialDelay, 0, maxDelay)

    if (jitter <= 0) {
        return clampedDelay
    }

    const jitterRange = clampedDelay * jitter
    const jitterOffset = (Math.random() - 0.5) * 2 * jitterRange

    return clamp(clampedDelay + jitterOffset, 0, maxDelay)
}

export interface WithRetryContext {
    attempts: number
    retriesLeft: number
    signal?: AbortSignal
}

export interface WithRetryOptions<T> extends GetRetryDelayOptions {
    maxAttempts?: number
    onBeforeWaitForNextAttempt?: (delay: number, context: WithRetryContext) => Awaitable<void>
    onFailedAttempt?: (error: unknown, context: WithRetryContext) => Awaitable<void>
    onSuccessAttempt?: (response: T, context: WithRetryContext) => Awaitable<void>
    shouldRetry?: (error: unknown, context: WithRetryContext) => Awaitable<boolean>
    shouldRetryOnSuccess?: (result: T, context: WithRetryContext) => Awaitable<boolean>
    signal?: AbortSignal
}

export function createRetryError(errors: unknown[]) {
    if (errors.length === 1) {
        return errors[0]
    }

    return new AggregateError(errors, 'All retry attempts failed')
}

export function rethrowNonAbortError(error: unknown) {
    if (!isAbortError(error)) {
        throw error
    }
}

export async function waitForNextRetryAttempt(attempts: number, delayOptions: GetRetryDelayOptions, onBeforeWaitForNextAttempt: WithRetryOptions<unknown>['onBeforeWaitForNextAttempt'], signal: AbortSignal | undefined, context: WithRetryContext) {
    const delay = getRetryDelay(attempts, delayOptions)

    await onBeforeWaitForNextAttempt?.(delay, context)
    await sleep(delay, { signal }).catch(rethrowNonAbortError)
}

export async function handleRetryFailure<T>(error: unknown, errors: unknown[], retriesLeft: number, shouldRetry: WithRetryOptions<T>['shouldRetry'], onFailedAttempt: WithRetryOptions<T>['onFailedAttempt'], context: WithRetryContext) {
    if (isAbortError(error)) {
        throw error
    }

    errors.push(error)

    if (retriesLeft <= 0) {
        throw createRetryError(errors)
    }

    if (shouldRetry && !(await shouldRetry(error, context))) {
        throw createRetryError(errors)
    }

    await onFailedAttempt?.(error, context)
}

export async function handleRetrySuccess<T>(result: T, errors: unknown[], retriesLeft: number, shouldRetryOnSuccess: WithRetryOptions<T>['shouldRetryOnSuccess'], onSuccessAttempt: WithRetryOptions<T>['onSuccessAttempt'], context: WithRetryContext): Promise<boolean> {
    if (!shouldRetryOnSuccess || !(await shouldRetryOnSuccess(result, context))) {
        return true
    }

    if (retriesLeft <= 0) {
        throw createRetryError(errors)
    }

    await onSuccessAttempt?.(result, context)

    return false
}

export async function withRetry<T>(fn: (signal?: AbortSignal) => Awaitable<T>, { maxAttempts = 3, onBeforeWaitForNextAttempt, onFailedAttempt, onSuccessAttempt, shouldRetry, shouldRetryOnSuccess, signal, ...delayOptions }: WithRetryOptions<T> = {}): Promise<T> {
    if (maxAttempts < 1) {
        throw new RangeError('maxAttempts must be at least 1')
    }

    if (signal) {
        signal.throwIfAborted()
    }

    let attempts = 0
    let result: T

    const errors: unknown[] = []

    while (attempts < maxAttempts) {
        const retriesLeft = maxAttempts - ((attempts++) + 1)
        const context = { attempts, retriesLeft, signal }

        try {
            if (signal) {
                signal.throwIfAborted()
            }

            result = await abortable(Promise.resolve(fn(signal)), signal)
        } catch (error) {
            await handleRetryFailure(error, errors, retriesLeft, shouldRetry, onFailedAttempt, context)
            await waitForNextRetryAttempt(attempts, delayOptions, onBeforeWaitForNextAttempt, signal, context)

            continue
        }

        const shouldReturn = await handleRetrySuccess(result, errors, retriesLeft, shouldRetryOnSuccess, onSuccessAttempt, context)

        if (shouldReturn) {
            return result
        }

        await waitForNextRetryAttempt(attempts, delayOptions, onBeforeWaitForNextAttempt, signal, context)
    }

    throw createRetryError(errors)
}
