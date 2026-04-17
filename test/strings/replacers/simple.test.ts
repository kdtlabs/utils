import { describe, expect, test } from 'bun:test'
import { simpleReplacer } from '../../../src/strings/replacers/simple'

describe('simpleReplacer', () => {
    test('has correct name', () => {
        expect(simpleReplacer.name).toBe('simple')
    })

    test('replaces exact match', () => {
        expect(simpleReplacer.replace('hello world', 'world', 'earth')).toBe('hello earth')
    })

    test('replaces first occurrence only', () => {
        expect(simpleReplacer.replace('aaa', 'a', 'b')).toBe('baa')
    })

    test('returns null when not found', () => {
        expect(simpleReplacer.replace('hello', 'xyz', 'abc')).toBeNull()
    })

    test('replaces at start', () => {
        expect(simpleReplacer.replace('hello world', 'hello', 'hi')).toBe('hi world')
    })

    test('replaces at end', () => {
        expect(simpleReplacer.replace('hello world', 'world', '')).toBe('hello ')
    })

    test('replaces with empty string', () => {
        expect(simpleReplacer.replace('abc', 'b', '')).toBe('ac')
    })

    test('replaces entire source', () => {
        expect(simpleReplacer.replace('abc', 'abc', 'xyz')).toBe('xyz')
    })
})
