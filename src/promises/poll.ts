import type { Awaitable } from './types'
import { assertParam } from '../common'
import { createAbortController, isAbortError } from '../errors'
import { isFunction } from '../functions'
import { isPlainObject } from '../objects'
import { abortable } from './abortable'
import { sleep } from './timers'

export interface PollOptions {
    delay?: number
    immediately?: boolean
    onError?: (error: unknown) => void
    stopOnError?: boolean
}

export type PollFn = (signal: AbortSignal) => Awaitable<void>

export function poll(fn: PollFn, options?: PollOptions): () => Promise<void>
export function poll(options: PollOptions, fn: PollFn): () => Promise<void>

export function poll(fnOrOptions: PollFn | PollOptions, optionsOrFn: PollFn | PollOptions = {}) {
    let fn: PollFn
    let options: PollOptions

    if (isFunction(fnOrOptions) && isPlainObject(optionsOrFn)) {
        fn = fnOrOptions
        options = optionsOrFn
    } else {
        assertParam(isPlainObject(fnOrOptions), 'options must be an object')
        assertParam(isFunction(optionsOrFn), 'fn must be a function')

        fn = optionsOrFn
        options = fnOrOptions
    }

    const { delay = 0, immediately = true, onError, stopOnError = true } = options
    const abortController = createAbortController()

    let isActive = true
    let currentTask: Promise<void> | undefined

    const stop = () => {
        isActive = false
        abortController.abort()

        return currentTask ?? Promise.resolve()
    }

    let startRun: () => void

    const run = async () => {
        if (!isActive) {
            return
        }

        try {
            await abortable(Promise.resolve(fn(abortController.signal)), abortController.signal)

            if (isActive) {
                await sleep(delay, { signal: abortController.signal })
            }
        } catch (error) {
            if (isAbortError(error) && !isActive) {
                return
            }

            onError?.(error)

            if (stopOnError) {
                stop()

                return
            }
        }

        setTimeout(startRun, 0)
    }

    startRun = () => {
        currentTask = run().finally(() => {
            currentTask = undefined
        })
    }

    if (immediately) {
        Promise.resolve().then(startRun)
    } else {
        setTimeout(startRun, delay)
    }

    return stop
}
