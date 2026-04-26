import type { UrlLike } from '../strings'
import { combineSignals } from '../errors'
import { resolveOptions } from '../objects'
import { withRetry, type WithRetryOptions, withTimeout } from '../promises'

export interface FetchOptions extends Omit<RequestInit, 'signal'> {
    retry?: Omit<WithRetryOptions<Response>, 'signal'> & { enabled?: boolean } | boolean
    signal?: AbortSignal
    timeout?: number
}

export async function fetch(request: RequestInfo | UrlLike, { retry = true, signal, timeout = 10_000, ...options }: FetchOptions = {}) {
    const retryOptions = { enabled: true, ...(resolveOptions(retry, {}) || { enabled: false }) }

    const execute = async (retrySignal?: AbortSignal) => {
        return withTimeout(globalThis.fetch(request, { ...options, signal: combineSignals(signal, retrySignal) }), timeout)
    }

    return retryOptions.enabled ? await withRetry(execute, { ...retryOptions, signal }) : await execute()
}
