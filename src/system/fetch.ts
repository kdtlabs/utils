import type { UrlLike } from '@/strings'
import { combineSignals, createAbortController } from '@/errors'
import { resolveOptions } from '@/objects'
import { withRetry, type WithRetryOptions } from '@/promises'

export interface FetchOptions extends Omit<RequestInit, 'signal'> {
    retry?: Omit<WithRetryOptions<Response>, 'signal'> & { enabled?: boolean } | boolean
    signal?: AbortSignal
    timeout?: number
}

export async function fetch(request: RequestInfo | UrlLike, { retry = true, signal, timeout = 10_000, ...options }: FetchOptions = {}) {
    const retryOptions = { enabled: true, ...(resolveOptions(retry, {}) || { enabled: false }) }

    const execute = async (retrySignal?: AbortSignal) => {
        const controller = createAbortController(timeout)
        const fetchSignal = combineSignals(controller.signal, signal, retrySignal)

        return globalThis.fetch(request, { ...options, signal: fetchSignal }).finally(() => controller.abort())
    }

    return retryOptions.enabled ? await withRetry(execute, { ...retryOptions, signal }) : await execute()
}
