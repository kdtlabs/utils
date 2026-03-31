import { notNullish, type Nullish } from '../core'

export function combineSignals(...signals: Array<Nullish<AbortSignal>>) {
    const validSignals = signals.filter(notNullish)

    if (validSignals.length === 0) {
        return new AbortController().signal
    }

    if (validSignals.length === 1) {
        return validSignals[0]!
    }

    return AbortSignal.any(validSignals)
}
