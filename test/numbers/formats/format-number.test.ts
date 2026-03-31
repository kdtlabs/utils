import { describe, expect, it } from 'bun:test'
import { formatNumber } from '@/numbers/formats'

describe('formatNumber', () => {
    describe('basic formatting', () => {
        it('formats an integer with thousand separators', () => {
            expect(formatNumber(1234)).toBe('1,234')
        })

        it('formats a large integer', () => {
            expect(formatNumber(1_234_567_890)).toBe('1,234,567,890')
        })

        it('formats zero', () => {
            expect(formatNumber(0)).toBe('0')
        })

        it('formats a negative integer', () => {
            expect(formatNumber(-1234)).toBe('-1,234')
        })

        it('formats a small number without thousand separator', () => {
            expect(formatNumber(999)).toBe('999')
        })
    })

    describe('decimal formatting', () => {
        it('formats a number with 1 decimal', () => {
            expect(formatNumber(1.5)).toBe('1.5')
        })

        it('formats a number with 2 decimals', () => {
            expect(formatNumber(3.14)).toBe('3.14')
        })

        it('formats a number with 4 decimals', () => {
            expect(formatNumber(1.2345)).toBe('1.2345')
        })

        it('truncates beyond default 4 decimals', () => {
            expect(formatNumber(1.234_567_89)).toBe('1.2346')
        })

        it('formats a negative decimal', () => {
            expect(formatNumber(-3.14)).toBe('-3.14')
        })

        it('formats a number with trailing zeros', () => {
            expect(formatNumber(1.1)).toBe('1.1')
        })

        it('formats integer + fraction with thousand separator', () => {
            expect(formatNumber(1234.5678)).toBe('1,234.5678')
        })
    })

    describe('leading zeros grouping (0.000xxx pattern)', () => {
        it('groups 3 leading zeros with subscript notation', () => {
            const result = formatNumber(0.000_123, { maximumFractionDigits: 6 })
            expect(result).toContain('0\u2083')
        })

        it('groups 4 leading zeros', () => {
            const result = formatNumber(0.000_012_34, { maximumFractionDigits: 8 })
            expect(result).toContain('0\u2084')
        })

        it('groups 2 leading zeros', () => {
            const result = formatNumber(0.0056, { maximumFractionDigits: 4 })
            expect(result).toContain('0\u2082')
        })

        it('groups 5 leading zeros', () => {
            const result = formatNumber(0.000_005_6, { maximumFractionDigits: 10 })
            expect(result).toContain('0\u2085')
        })

        it('does not group 0 leading zeros', () => {
            expect(formatNumber(0.5)).toBe('0.5')
        })

        it('does not group 1 leading zero', () => {
            expect(formatNumber(0.05)).toBe('0.05')
        })

        it('preserves significant digits after grouped zeros', () => {
            const result = formatNumber(0.000_456, { maximumFractionDigits: 6 })
            expect(result).toContain('456')
        })

        it('handles negative number with leading zeros', () => {
            const result = formatNumber(-0.000_123, { maximumFractionDigits: 6 })
            expect(result).toContain('0\u2083')
            expect(result).toStartWith('-')
        })

        it('handles very small exponential input', () => {
            const result = formatNumber(1.5e-6, { maximumFractionDigits: 10 })
            expect(result).toContain('0\u2085')
        })

        it('handles 0.001 with exactly 2 leading zeros', () => {
            const result = formatNumber(0.001, { maximumFractionDigits: 3 })
            expect(result).toContain('0\u2082')
        })
    })

    describe('groupFractionLeadingZeros option', () => {
        it('disables leading zero grouping when false', () => {
            const result = formatNumber(0.000_123, {
                groupFractionLeadingZeros: false,
                maximumFractionDigits: 6,
            })

            expect(result).toBe('0.000123')
        })

        it('formats normally without grouping', () => {
            const result = formatNumber(1234, { groupFractionLeadingZeros: false })
            expect(result).toBe('1,234')
        })

        it('respects maximumFractionDigits when grouping disabled', () => {
            const result = formatNumber(0.000_123, {
                groupFractionLeadingZeros: false,
                maximumFractionDigits: 4,
            })

            expect(result).toBe('0.0001')
        })
    })

    describe('maximumFractionDigits option', () => {
        it('limits to 0 fraction digits', () => {
            expect(formatNumber(3.7, {
                groupFractionLeadingZeros: false,
                maximumFractionDigits: 0,
            })).toBe('4')
        })

        it('limits to 2 fraction digits', () => {
            expect(formatNumber(1.234_56, {
                groupFractionLeadingZeros: false,
                maximumFractionDigits: 2,
            })).toBe('1.23')
        })

        it('limits to 10 fraction digits', () => {
            const result = formatNumber(0.123_456_789_01, {
                groupFractionLeadingZeros: false,
                maximumFractionDigits: 10,
            })

            expect(result).toBe('0.123456789')
        })

        it('defaults to 4 fraction digits', () => {
            expect(formatNumber(1.123_456_789)).toBe('1.1235')
        })

        it('extends fraction digits beyond leading zeros when grouping', () => {
            const result = formatNumber(0.000_123_456, { maximumFractionDigits: 4 })
            expect(result).toContain('0\u2083')
        })
    })

    describe('locales option', () => {
        it('formats with German locale', () => {
            const result = formatNumber(1234.5, {
                groupFractionLeadingZeros: false,
                locales: 'de-DE',
            })

            expect(result).toBe('1.234,5')
        })

        it('formats with French locale', () => {
            const result = formatNumber(1234.5, {
                groupFractionLeadingZeros: false,
                locales: 'fr-FR',
            })

            expect(result).toContain('234')
        })

        it('defaults to en-US locale', () => {
            expect(formatNumber(1234.56)).toBe('1,234.56')
        })
    })

    describe('formatLeadingZeros option', () => {
        it('uses custom formatter for leading zeros', () => {
            const result = formatNumber(0.000_123, {
                formatLeadingZeros: (count) => `(${count}×0)`,
                maximumFractionDigits: 6,
            })

            expect(result).toContain('(3×0)')
        })

        it('uses custom formatter that returns empty string', () => {
            const result = formatNumber(0.000_123, {
                formatLeadingZeros: () => '',
                maximumFractionDigits: 6,
            })

            expect(result).not.toContain('000')
        })

        it('passes correct count to custom formatter', () => {
            let capturedCount = 0

            formatNumber(0.000_01, {
                formatLeadingZeros: (count) => {
                    capturedCount = count

                    return `0_${count}`
                },
                maximumFractionDigits: 6,
            })

            expect(capturedCount).toBe(4)
        })
    })

    describe('input types', () => {
        it('formats a string numeric input', () => {
            expect(formatNumber('1234.5' as never)).toBe('1,234.5')
        })

        it('formats a bigint input', () => {
            expect(formatNumber(123_456n)).toBe('123,456')
        })

        it('formats a very large number', () => {
            const result = formatNumber(999_999_999_999)
            expect(result).toBe('999,999,999,999')
        })

        it('formats a very small positive number', () => {
            const result = formatNumber(0.000_000_01, { maximumFractionDigits: 10 })
            expect(result).toContain('0\u2087')
        })
    })

    describe('Intl.NumberFormatOptions passthrough', () => {
        it('passes through style option', () => {
            const result = formatNumber(0.75, {
                groupFractionLeadingZeros: false,
                maximumFractionDigits: 0,
                style: 'percent',
            })

            expect(result).toBe('75%')
        })

        it('passes through currency options', () => {
            const result = formatNumber(1234.5, {
                currency: 'USD',
                groupFractionLeadingZeros: false,
                maximumFractionDigits: 2,
                style: 'currency',
            })

            expect(result).toBe('$1,234.50')
        })

        it('passes through minimumFractionDigits', () => {
            const result = formatNumber(1.5, {
                groupFractionLeadingZeros: false,
                minimumFractionDigits: 4,
            })

            expect(result).toBe('1.5000')
        })
    })

    describe('edge cases', () => {
        it('formats 0.0 without grouping', () => {
            expect(formatNumber(0)).toBe('0')
        })

        it('formats -0', () => {
            const result = formatNumber(-0)
            expect(result === '0' || result === '-0').toBe(true)
        })

        it('formats number with no fraction as integer', () => {
            expect(formatNumber(42)).toBe('42')
        })

        it('formats 0.1 correctly', () => {
            expect(formatNumber(0.1)).toBe('0.1')
        })

        it('formats 0.01 with single leading zero', () => {
            expect(formatNumber(0.01)).toBe('0.01')
        })

        it('formats 0.10 without trailing zeros', () => {
            expect(formatNumber(0.1)).toBe('0.1')
        })

        it('handles default options', () => {
            const result = formatNumber(12_345.6789)
            expect(result).toBe('12,345.6789')
        })

        it('handles empty options object', () => {
            const result = formatNumber(12_345.6789, {})
            expect(result).toBe('12,345.6789')
        })
    })
})
