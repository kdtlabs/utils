import { describe, expect, it } from 'bun:test'
import { trimRepeated } from '@/strings/manipulations'

describe('trimRepeated', () => {
    it('collapses consecutive duplicate single characters', () => {
        expect(trimRepeated('heeello', 'e')).toBe('hello')
    })

    it('collapses consecutive duplicate spaces', () => {
        expect(trimRepeated('hello  world  foo', ' ')).toBe('hello world foo')
    })

    it('collapses multi-char target', () => {
        expect(trimRepeated('helloworldworldworldfoo', 'world')).toBe('helloworldfoo')
    })

    it('returns the original string when no repeats', () => {
        expect(trimRepeated('hello world', ' ')).toBe('hello world')
    })

    it('returns the original string when target not found', () => {
        expect(trimRepeated('hello world', 'x')).toBe('hello world')
    })

    it('collapses entire string of repeated target to single', () => {
        expect(trimRepeated('aaa', 'a')).toBe('a')
    })

    it('handles empty input', () => {
        expect(trimRepeated('', ' ')).toBe('')
    })

    it('handles special regex characters in target', () => {
        expect(trimRepeated('a..b....c', '..')).toBe('a..b..c')
    })

    it('handles target at start and end', () => {
        expect(trimRepeated('---hello---', '-')).toBe('-hello-')
    })
})
