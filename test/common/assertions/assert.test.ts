import { describe, expect, it } from 'bun:test'
import { assert } from '../../../src/common/assertions'

describe('assert', () => {
    it('does not throw for truthy values', () => {
        expect(() => assert(true, 'fail')).not.toThrow()
        expect(() => assert(1, 'fail')).not.toThrow()
        expect(() => assert('non-empty', 'fail')).not.toThrow()
        expect(() => assert({}, 'fail')).not.toThrow()
        expect(() => assert([], 'fail')).not.toThrow()
    })

    it('throws Error with string message', () => {
        expect(() => assert(false, 'boom')).toThrow(Error)
        expect(() => assert(false, 'boom')).toThrow('boom')
    })

    it('throws the provided Error instance', () => {
        const error = new RangeError('out of range')

        expect(() => assert(false, error)).toThrow(error)
    })

    it('throws Error from lazy function returning string', () => {
        expect(() => assert(false, () => 'lazy message')).toThrow('lazy message')
    })

    it('throws Error from lazy function returning Error', () => {
        const error = new TypeError('lazy error')

        expect(() => assert(false, () => error)).toThrow(error)
    })

    it('throws with custom error constructor', () => {
        expect(() => assert(false, 'bad type', TypeError)).toThrow(TypeError)
    })

    it('throws for various falsy values', () => {
        expect(() => assert(false, 'false')).toThrow()
        expect(() => assert(0, 'zero')).toThrow()
        expect(() => assert('', 'empty string')).toThrow()
        expect(() => assert(null, 'null')).toThrow()
        expect(() => assert(undefined, 'undefined')).toThrow()
        expect(() => assert(Number.NaN, 'NaN')).toThrow()
    })
})
