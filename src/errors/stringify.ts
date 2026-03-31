import { isString, notNullish } from '../core'
import { isObject } from '../objects'
import { normalizeError, type NormalizeErrorOptions } from './factories'

export interface StringifyErrorFormatters {
    code?: (code: string) => string
    message?: (message: string) => string
    name?: (name: string) => string
}

export interface StringifyErrorOptions extends NormalizeErrorOptions {
    causeIndent?: number
    causePrefix?: string
    circularReferenceMessage?: string
    formatters?: StringifyErrorFormatters
    includeCause?: boolean
    includeCode?: boolean
    includeName?: boolean
    maxCauseDepth?: number
}

export const DEFAULT_STRINGIFY_FORMATTERS: Required<StringifyErrorFormatters> = {
    code: (value) => `[${value}]`,
    message: (value) => value,
    name: (value) => `${value}:`,
}

export interface StringifyErrorState {
    causeIndent: number
    causePrefix: string
    circularReferenceMessage: string
    defaultMessage: string
    formatters: Required<StringifyErrorFormatters>
    includeCause: boolean
    includeCode: boolean
    includeName: boolean
    maxCauseDepth: number
    normalizeOptions: NormalizeErrorOptions
    visited: Set<unknown>
}

export function collectCauses(error: Error, depth: number, indent: string, state: StringifyErrorState) {
    const childIndent = indent + ' '.repeat(state.causeIndent)
    const pointers: string[] = []

    if (error instanceof AggregateError && error.errors.length > 0) {
        for (const subError of error.errors) {
            pointers.push(stringifyErrorNode(subError, depth - 1, childIndent, state.causePrefix, state))
        }
    }

    if (isObject(error.cause) || isString(error.cause)) {
        pointers.push(stringifyErrorNode(error.cause, depth - 1, childIndent, state.causePrefix, state))
    }

    return pointers
}

export function appendCauses(parts: string[], error: Error, error_: unknown, depth: number, indent: string, state: StringifyErrorState) {
    if (!state.includeCause || depth <= 0 || (error !== error_ && error.cause === error_)) {
        return
    }

    const pointers = collectCauses(error, depth, indent, state)

    if (pointers.length > 0) {
        parts.push(`\n${pointers.join('\n')}`)
    }
}

export function buildErrorParts(error: Error, state: StringifyErrorState) {
    const parts: string[] = []

    if (state.includeCode && 'code' in error && notNullish(error.code)) {
        parts.push(state.formatters.code(String(error.code)))
    }

    if (state.includeName) {
        parts.push(state.formatters.name(error.name))
    }

    parts.push(state.formatters.message(error.message || state.defaultMessage))

    return parts
}

export function stringifyErrorNode(error_: unknown, depth: number, indent: string, prefix: string, state: StringifyErrorState): string {
    if (state.visited.has(error_)) {
        return `${indent}${prefix}${state.circularReferenceMessage}`
    }

    if (error_ instanceof Error) {
        state.visited.add(error_)
    }

    if (error_ instanceof Error && error_.toString !== Error.prototype.toString) {
        const parts = [error_.toString()]
        appendCauses(parts, error_, error_, depth, indent, state)

        return indent + prefix + parts.join(' ')
    }

    const error = normalizeError(error_, { ...state.normalizeOptions, defaultMessage: state.defaultMessage })

    state.visited.add(error)

    const parts = buildErrorParts(error, state)
    appendCauses(parts, error, error_, depth, indent, state)

    return indent + prefix + parts.join(' ')
}

export function stringifyError(error: unknown, options: StringifyErrorOptions = {}) {
    const { causeIndent = 2, causePrefix = '-> ', circularReferenceMessage = '[Circular Reference]', defaultMessage = 'Unknown error', formatters: formatters_ = {}, includeCause = true, includeCode = true, includeName = true, maxCauseDepth = Number.POSITIVE_INFINITY, ...normalizeOptions } = options

    const state: StringifyErrorState = {
        causeIndent,
        causePrefix,
        circularReferenceMessage,
        defaultMessage,
        formatters: { ...DEFAULT_STRINGIFY_FORMATTERS, ...formatters_ },
        includeCause,
        includeCode,
        includeName,
        maxCauseDepth,
        normalizeOptions,
        visited: new Set<unknown>(),
    }

    return stringifyErrorNode(error, maxCauseDepth, '', '', state)
}
