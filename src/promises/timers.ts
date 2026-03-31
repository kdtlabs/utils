import { combineSignals, createAbortController, type Errorable } from '@/errors'
import { transform } from '@/functions'
import { abortable } from './abortable'

export interface TimerOptions {
    error?: Errorable
    signal?: AbortSignal
}

export const sleep = async (ms: number, { error, signal }: TimerOptions = {}) => (
    abortable(new Promise<void>((resolve) => setTimeout(resolve, ms)), signal, error)
)

export const withTimeout = <T>(promise: Promise<T>, ms: number, { error, signal }: TimerOptions = {}) => (
    transform(createAbortController(ms, error), (controller) => abortable(promise, combineSignals(signal, controller.signal)).finally(() => controller.abort()))
)
