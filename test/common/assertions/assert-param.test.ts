import { describe, expect, it } from 'bun:test'
import { assertParam } from '../../../src/common/assertions'

describe('assertParam', () => {
    it('does not throw for truthy values', () => {
        expect(() => assertParam(true, 'fail')).not.toThrow()
        expect(() => assertParam(1, 'fail')).not.toThrow()
        expect(() => assertParam('non-empty', 'fail')).not.toThrow()
    })

    it('defaults to TypeError when no constructor is provided', () => {
        expect(() => assertParam(false, 'bad param')).toThrow(TypeError)
    })

    it('uses the provided error constructor over the default', () => {
        expect(() => assertParam(false, 'range error', RangeError)).toThrow(RangeError)
    })

    it('throws TypeError with string message', () => {
        expect(() => assertParam(false, 'invalid')).toThrow('invalid')
    })

    it('throws the provided Error instance', () => {
        const error = new RangeError('out of range')

        expect(() => assertParam(false, error)).toThrow(error)
    })

    it('throws from lazy function returning string with TypeError default', () => {
        expect(() => assertParam(false, () => 'lazy')).toThrow(TypeError)
        expect(() => assertParam(false, () => 'lazy')).toThrow('lazy')
    })

    it('throws from lazy function returning Error', () => {
        const error = new SyntaxError('parse fail')

        expect(() => assertParam(false, () => error)).toThrow(error)
    })

    it('throws for various falsy values', () => {
        expect(() => assertParam(false, 'f')).toThrow()
        expect(() => assertParam(0, 'z')).toThrow()
        expect(() => assertParam('', 'e')).toThrow()
        expect(() => assertParam(null, 'n')).toThrow()
        expect(() => assertParam(undefined, 'u')).toThrow()
        expect(() => assertParam(Number.NaN, 'nan')).toThrow()
    })
})
