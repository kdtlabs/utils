import { describe, expect, it } from 'bun:test'
import { OMIT_SENTINEL } from '@/serializer/constants'
import { handleError } from '@/serializer/utils'
import { createTestContext } from './helpers'

describe('handleError', () => {
    it('throw strategy throws Error with placeholder message', () => {
        const ctx = createTestContext()
        expect(() => handleError('throw', 'CircularRef', 'circular reference detected', ctx)).toThrow('circular reference detected')
    })

    it('omit strategy returns OMIT_SENTINEL', () => {
        const ctx = createTestContext()
        const result = handleError('omit', 'CircularRef', 'circular reference detected', ctx)
        expect(result).toBe(OMIT_SENTINEL)
    })

    it('placeholder strategy returns replacer result with type and value', () => {
        const ctx = createTestContext()
        const result = handleError('placeholder', 'CircularRef', '[Circular]', ctx) as Record<string, unknown>

        expect(result.__serialized__).toBe(true)
        expect(result.type).toBe('CircularRef')
        expect(result.value).toBe('[Circular]')
    })

    it('placeholder strategy passes correct type to replacer', () => {
        let capturedType: string | undefined

        const ctx = createTestContext({
            replacer: (v) => {
                capturedType = v.type

                return { ...v, __serialized__: true } as never
            },
        })

        handleError('placeholder', 'MaxDepth', 'too deep', ctx)
        expect(capturedType).toBe('MaxDepth')
    })

    it('placeholder strategy passes correct value to replacer', () => {
        let capturedValue: unknown

        const ctx = createTestContext({
            replacer: (v) => {
                capturedValue = v.value

                return { ...v, __serialized__: true } as never
            },
        })

        handleError('placeholder', 'PropertyAccess', 'access error', ctx)
        expect(capturedValue).toBe('access error')
    })
})
