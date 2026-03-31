import type { AnyObject, DeepPartial } from './types'
import { isArray } from '@/arrays'
import { unique } from '@/arrays/set-operations'
import { isPlainObject } from './guards'

export type DeepMergeArrayMode = 'merge' | 'merge-dedupe' | 'replace'

export interface DeepMergeOptions {
    arrayMode?: DeepMergeArrayMode
}

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

function mergeArrays(base: unknown[], override: unknown[], arrayMode: DeepMergeArrayMode): unknown[] {
    if (arrayMode === 'replace') {
        return override.map(deepCloneValue)
    }

    const merged = [...base, ...override]
    const deduped = arrayMode === 'merge-dedupe' ? unique(merged) : merged

    return deduped.map(deepCloneValue)
}

function deepCloneValue(value: unknown): unknown {
    if (isPlainObject(value)) {
        const cloned: Record<string, unknown> = {}

        for (const key of Object.keys(value)) {
            if (!DANGEROUS_KEYS.has(key)) {
                cloned[key] = deepCloneValue(value[key])
            }
        }

        return cloned
    }

    if (isArray(value)) {
        return value.map(deepCloneValue)
    }

    return value
}

function mergeRecursive(base: Record<string, unknown>, override: Record<string, unknown>, arrayMode: DeepMergeArrayMode): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const key of Object.keys(base)) {
        if (!DANGEROUS_KEYS.has(key)) {
            result[key] = deepCloneValue(base[key])
        }
    }

    for (const key of Object.keys(override)) {
        if (DANGEROUS_KEYS.has(key)) {
            continue
        }

        const baseVal = result[key]
        const overrideVal = override[key]

        if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
            result[key] = mergeRecursive(baseVal, overrideVal, arrayMode)
        } else if (isArray(baseVal) && isArray(overrideVal)) {
            result[key] = mergeArrays(baseVal, overrideVal, arrayMode)
        } else {
            result[key] = deepCloneValue(overrideVal)
        }
    }

    return result
}

export const deepMerge = <T extends AnyObject>(base: T, override: DeepPartial<T>, { arrayMode = 'replace' }: DeepMergeOptions = {}): T => (
    mergeRecursive(base, override as Record<string, unknown>, arrayMode) as T
)
