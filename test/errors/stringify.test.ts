import { describe, expect, it } from 'bun:test'
import { DEFAULT_STRINGIFY_FORMATTERS, stringifyError } from '@/errors/stringify'

describe('stringifyError', () => {
    describe('basic errors', () => {
        it('stringifies a plain Error', () => {
            expect(stringifyError(new Error('boom'))).toBe('Error: boom')
        })

        it('stringifies a TypeError', () => {
            expect(stringifyError(new TypeError('bad type'))).toBe('TypeError: bad type')
        })

        it('stringifies a RangeError', () => {
            expect(stringifyError(new RangeError('out of range'))).toBe('RangeError: out of range')
        })

        it('stringifies an Error with empty message using defaultMessage', () => {
            // eslint-disable-next-line unicorn/error-message -- intentionally testing empty message
            expect(stringifyError(new Error(''))).toBe('Error: Unknown error')
        })
    })

    describe('non-error inputs', () => {
        it('wraps a string input into Error', () => {
            expect(stringifyError('something broke')).toBe('Error: something broke')
        })

        it('wraps an empty string using defaultMessage', () => {
            expect(stringifyError('')).toBe('Error: Unknown error')
        })

        it('wraps a number into Error with defaultMessage', () => {
            expect(stringifyError(42)).toBe('Error: Unknown error')
        })

        it('wraps a boolean into Error with defaultMessage', () => {
            expect(stringifyError(true)).toBe('Error: Unknown error')
        })

        it('wraps null into Error with defaultMessage', () => {
            expect(stringifyError(null)).toBe('Error: Unknown error')
        })

        it('wraps undefined into Error with defaultMessage', () => {
            expect(stringifyError(undefined)).toBe('Error: Unknown error')
        })

        it('wraps a symbol into Error with defaultMessage', () => {
            expect(stringifyError(Symbol('test'))).toBe('Error: Unknown error')
        })

        it('wraps a bigint into Error with defaultMessage', () => {
            expect(stringifyError(99n)).toBe('Error: Unknown error')
        })

        it('wraps a plain object (non-ErrorLike) into Error with defaultMessage', () => {
            expect(stringifyError({ foo: 'bar' })).toBe('Error: Unknown error')
        })

        it('wraps an ErrorLike object', () => {
            expect(stringifyError({ message: 'parsed from JSON', name: 'CustomError' })).toBe('CustomError: parsed from JSON')
        })

        it('wraps an ErrorLike with code', () => {
            expect(stringifyError({ code: 'ERR_404', message: 'not found', name: 'ApiError' })).toBe('[ERR_404] ApiError: not found')
        })
    })

    describe('error with code property', () => {
        it('includes code when present', () => {
            const error = Object.assign(new Error('not found'), { code: 'ENOENT' })
            expect(stringifyError(error)).toBe('[ENOENT] Error: not found')
        })

        it('includes numeric code', () => {
            const error = Object.assign(new Error('fail'), { code: 404 })
            expect(stringifyError(error)).toBe('[404] Error: fail')
        })

        it('excludes code when null', () => {
            const error = Object.assign(new Error('fail'), { code: null })
            expect(stringifyError(error)).toBe('Error: fail')
        })

        it('excludes code when undefined', () => {
            const error = Object.assign(new Error('fail'), { code: undefined })
            expect(stringifyError(error)).toBe('Error: fail')
        })
    })

    describe('cause chain', () => {
        it('traverses a single cause', () => {
            const error = new Error('top', { cause: new Error('root') })
            expect(stringifyError(error)).toBe('Error: top \n  -> Error: root')
        })

        it('traverses a deep cause chain', () => {
            const error = new Error('L1', { cause: new Error('L2', { cause: new Error('L3') }) })
            expect(stringifyError(error)).toBe('Error: L1 \n  -> Error: L2 \n    -> Error: L3')
        })

        it('traverses a string cause', () => {
            const error = new Error('top', { cause: 'string reason' })
            expect(stringifyError(error)).toBe('Error: top \n  -> Error: string reason')
        })

        it('ignores primitive number cause', () => {
            const error = new Error('top', { cause: 42 })
            expect(stringifyError(error)).toBe('Error: top')
        })

        it('ignores primitive boolean cause', () => {
            const error = new Error('top', { cause: false })
            expect(stringifyError(error)).toBe('Error: top')
        })

        it('ignores null cause', () => {
            const error = new Error('top');
            (error as any).cause = null
            expect(stringifyError(error)).toBe('Error: top')
        })

        it('ignores undefined cause', () => {
            const error = new Error('top', { cause: undefined })
            expect(stringifyError(error)).toBe('Error: top')
        })

        it('traverses an ErrorLike cause', () => {
            const error = new Error('top', { cause: { message: 'connection refused', name: 'DbError' } })
            expect(stringifyError(error)).toBe('Error: top \n  -> DbError: connection refused')
        })
    })

    describe('AggregateError', () => {
        it('stringifies with sub-errors', () => {
            const error = new AggregateError([new Error('a'), new Error('b')], 'multi')
            expect(stringifyError(error)).toBe('AggregateError: multi \n  -> Error: a\n  -> Error: b')
        })

        it('stringifies empty AggregateError (no sub-errors)', () => {
            const error = new AggregateError([], 'empty')
            expect(stringifyError(error)).toBe('AggregateError: empty')
        })

        it('stringifies AggregateError with nested causes in sub-errors', () => {
            const error = new AggregateError([
                new Error('a', { cause: new Error('a-root') }),
            ], 'multi')

            expect(stringifyError(error)).toBe('AggregateError: multi \n  -> Error: a \n    -> Error: a-root')
        })

        it('stringifies AggregateError that also has its own cause', () => {
            const agg = new AggregateError([new Error('child')], 'agg');
            (agg as any).cause = new Error('agg-cause')
            expect(stringifyError(agg)).toBe('AggregateError: agg \n  -> Error: child\n  -> Error: agg-cause')
        })
    })

    describe('circular references', () => {
        it('detects direct circular cause', () => {
            const a = new Error('A');
            (a as any).cause = a
            expect(stringifyError(a)).toBe('Error: A \n  -> [Circular Reference]')
        })

        it('detects indirect circular cause', () => {
            const a = new Error('A')

            const b = new Error('B', { cause: a });
            (a as any).cause = b
            expect(stringifyError(a)).toBe('Error: A \n  -> Error: B \n    -> [Circular Reference]')
        })

        it('detects circular in AggregateError sub-errors', () => {
            const a = new Error('A')

            const agg = new AggregateError([a], 'agg');
            (a as any).cause = agg
            expect(stringifyError(agg)).toBe('AggregateError: agg \n  -> Error: A \n    -> [Circular Reference]')
        })

        it('uses custom circularReferenceMessage', () => {
            const a = new Error('A');
            (a as any).cause = a
            expect(stringifyError(a, { circularReferenceMessage: '(loop)' })).toBe('Error: A \n  -> (loop)')
        })
    })

    describe('custom toString() errors', () => {
        class CustomError extends Error {
            public constructor(public code: string, message: string) {
                super(message)
                this.name = 'CustomError'
            }

            public override toString() {
                return `[${this.code}] ${this.name}: ${this.message}`
            }
        }

        it('uses custom toString output', () => {
            expect(stringifyError(new CustomError('E01', 'fail'))).toBe('[E01] CustomError: fail')
        })

        it('applies indent and prefix for nested custom-toString error', () => {
            const root = new CustomError('E01', 'root')
            const top = new Error('top', { cause: root })
            expect(stringifyError(top)).toBe('Error: top \n  -> [E01] CustomError: root')
        })

        it('traverses cause chain on custom-toString error', () => {
            const inner = new Error('inner')

            const custom = new CustomError('E01', 'custom');
            (custom as any).cause = inner
            expect(stringifyError(custom)).toBe('[E01] CustomError: custom \n  -> Error: inner')
        })

        it('detects circular reference through custom-toString error', () => {
            const custom = new CustomError('E01', 'loop');
            (custom as any).cause = custom
            expect(stringifyError(custom)).toBe('[E01] CustomError: loop \n  -> [Circular Reference]')
        })

        it('respects includeCause=false on custom-toString error', () => {
            const custom = new CustomError('E01', 'fail');
            (custom as any).cause = new Error('ignored')
            expect(stringifyError(custom, { includeCause: false })).toBe('[E01] CustomError: fail')
        })

        it('respects maxCauseDepth=0 on custom-toString error', () => {
            const custom = new CustomError('E01', 'fail');
            (custom as any).cause = new Error('ignored')
            expect(stringifyError(custom, { maxCauseDepth: 0 })).toBe('[E01] CustomError: fail')
        })
    })

    describe('option: includeName', () => {
        it('excludes name when false', () => {
            expect(stringifyError(new Error('msg'), { includeName: false })).toBe('msg')
        })

        it('includes name by default', () => {
            expect(stringifyError(new Error('msg'))).toBe('Error: msg')
        })
    })

    describe('option: includeCode', () => {
        it('excludes code when false', () => {
            const error = Object.assign(new Error('msg'), { code: 'X' })
            expect(stringifyError(error, { includeCode: false })).toBe('Error: msg')
        })

        it('includes code by default', () => {
            const error = Object.assign(new Error('msg'), { code: 'X' })
            expect(stringifyError(error)).toBe('[X] Error: msg')
        })
    })

    describe('option: includeCause', () => {
        it('excludes cause chain when false', () => {
            const error = new Error('top', { cause: new Error('root') })
            expect(stringifyError(error, { includeCause: false })).toBe('Error: top')
        })
    })

    describe('option: maxCauseDepth', () => {
        it('limits cause traversal depth', () => {
            const error = new Error('L1', { cause: new Error('L2', { cause: new Error('L3', { cause: new Error('L4') }) }) })
            expect(stringifyError(error, { maxCauseDepth: 1 })).toBe('Error: L1 \n  -> Error: L2')
        })

        it('maxCauseDepth=0 shows no causes', () => {
            const error = new Error('L1', { cause: new Error('L2') })
            expect(stringifyError(error, { maxCauseDepth: 0 })).toBe('Error: L1')
        })

        it('maxCauseDepth=2 shows 2 levels', () => {
            const error = new Error('L1', { cause: new Error('L2', { cause: new Error('L3', { cause: new Error('L4') }) }) })
            expect(stringifyError(error, { maxCauseDepth: 2 })).toBe('Error: L1 \n  -> Error: L2 \n    -> Error: L3')
        })
    })

    describe('option: causeIndent', () => {
        it('uses custom indent width', () => {
            const error = new Error('top', { cause: new Error('root') })
            expect(stringifyError(error, { causeIndent: 4 })).toBe('Error: top \n    -> Error: root')
        })

        it('zero indent', () => {
            const error = new Error('top', { cause: new Error('root') })
            expect(stringifyError(error, { causeIndent: 0 })).toBe('Error: top \n-> Error: root')
        })
    })

    describe('option: causePrefix', () => {
        it('uses custom prefix', () => {
            const error = new Error('top', { cause: new Error('root') })
            expect(stringifyError(error, { causePrefix: 'caused by: ' })).toBe('Error: top \n  caused by: Error: root')
        })

        it('empty prefix', () => {
            const error = new Error('top', { cause: new Error('root') })
            expect(stringifyError(error, { causePrefix: '' })).toBe('Error: top \n  Error: root')
        })
    })

    describe('option: defaultMessage', () => {
        it('uses custom default for empty message', () => {
            // eslint-disable-next-line unicorn/error-message -- intentionally testing empty message
            expect(stringifyError(new Error(''), { defaultMessage: 'N/A' })).toBe('Error: N/A')
        })

        it('uses custom default for non-error input', () => {
            expect(stringifyError(123, { defaultMessage: 'Unexpected' })).toBe('Error: Unexpected')
        })
    })

    describe('option: formatters', () => {
        it('applies custom code formatter', () => {
            const error = Object.assign(new Error('msg'), { code: 'X' })
            expect(stringifyError(error, { formatters: { code: (c) => `<${c}>` } })).toBe('<X> Error: msg')
        })

        it('applies custom name formatter', () => {
            expect(stringifyError(new Error('msg'), { formatters: { name: (n) => `[${n}]` } })).toBe('[Error] msg')
        })

        it('applies custom message formatter', () => {
            expect(stringifyError(new Error('msg'), { formatters: { message: (m) => m.toUpperCase() } })).toBe('Error: MSG')
        })

        it('applies all custom formatters together', () => {
            const error = Object.assign(new Error('msg'), { code: 'C' })

            const formatters = {
                code: (c: string) => `{${c}}`,
                message: (m: string) => `"${m}"`,
                name: (n: string) => `(${n})`,
            }

            expect(stringifyError(error, { formatters })).toBe('{C} (Error) "msg"')
        })

        it('partial formatters merge with defaults', () => {
            const error = Object.assign(new Error('msg'), { code: 'C' })
            expect(stringifyError(error, { formatters: { code: (c) => `{${c}}` } })).toBe('{C} Error: msg')
        })
    })

    describe('option: errorConstructor', () => {
        it('normalizes using custom error constructor', () => {
            const result = stringifyError('oops', { errorConstructor: TypeError })
            expect(result).toBe('TypeError: oops')
        })
    })

    describe('DEFAULT_STRINGIFY_FORMATTERS', () => {
        it('formats code with brackets', () => {
            expect(DEFAULT_STRINGIFY_FORMATTERS.code('X')).toBe('[X]')
        })

        it('formats message as-is', () => {
            expect(DEFAULT_STRINGIFY_FORMATTERS.message('hello')).toBe('hello')
        })

        it('formats name with colon', () => {
            expect(DEFAULT_STRINGIFY_FORMATTERS.name('Error')).toBe('Error:')
        })
    })

    describe('edge cases', () => {
        it('handles same error referenced multiple times in AggregateError', () => {
            const shared = new Error('shared')
            const agg = new AggregateError([shared, shared], 'dup')
            expect(stringifyError(agg)).toBe('AggregateError: dup \n  -> Error: shared\n  -> [Circular Reference]')
        })

        it('handles deeply nested AggregateError', () => {
            const inner = new AggregateError([new Error('leaf')], 'inner')
            const outer = new AggregateError([inner], 'outer')
            expect(stringifyError(outer)).toBe('AggregateError: outer \n  -> AggregateError: inner \n    -> Error: leaf')
        })

        it('handles error with both AggregateError errors and cause', () => {
            const agg = new AggregateError([new Error('sub')], 'agg');
            (agg as any).cause = new Error('cause')
            const result = stringifyError(agg)
            expect(result).toContain('-> Error: sub')
            expect(result).toContain('-> Error: cause')
        })

        it('does not crash on function input', () => {
            expect(stringifyError(() => {})).toBe('Error: Unknown error')
        })

        it('does not crash on array input', () => {
            expect(stringifyError([1, 2, 3])).toBe('Error: Unknown error')
        })

        it('handles no options argument', () => {
            expect(stringifyError(new Error('test'))).toBe('Error: test')
        })

        it('handles empty options object', () => {
            expect(stringifyError(new Error('test'), {})).toBe('Error: test')
        })
    })
})
