import type { Fn } from './types'
import { isNonEmptyArray } from '../arrays'

export function pipe(): void
export function pipe<T>(fn: () => T): T
export function pipe<T1, T2>(fn1: () => T1, fn2: (arg: T1) => T2): T2
export function pipe<T1, T2, T3>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3): T3
export function pipe<T1, T2, T3, T4>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4): T4
export function pipe<T1, T2, T3, T4, T5>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5): T5
export function pipe<T1, T2, T3, T4, T5, T6>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6): T6
export function pipe<T1, T2, T3, T4, T5, T6, T7>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7): T7
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8): T8
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9): T9
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10): T10
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11): T11
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12): T12
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12, fn13: (arg: T12) => T13): T13
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12, fn13: (arg: T12) => T13, fn14: (arg: T13) => T14): T14
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12, fn13: (arg: T12) => T13, fn14: (arg: T13) => T14, fn15: (arg: T14) => T15): T15
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12, fn13: (arg: T12) => T13, fn14: (arg: T13) => T14, fn15: (arg: T14) => T15, fn16: (arg: T15) => T16): T16
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12, fn13: (arg: T12) => T13, fn14: (arg: T13) => T14, fn15: (arg: T14) => T15, fn16: (arg: T15) => T16, fn17: (arg: T16) => T17): T17
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12, fn13: (arg: T12) => T13, fn14: (arg: T13) => T14, fn15: (arg: T14) => T15, fn16: (arg: T15) => T16, fn17: (arg: T16) => T17, fn18: (arg: T17) => T18): T18
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12, fn13: (arg: T12) => T13, fn14: (arg: T13) => T14, fn15: (arg: T14) => T15, fn16: (arg: T15) => T16, fn17: (arg: T16) => T17, fn18: (arg: T17) => T18, fn19: (arg: T18) => T19): T19
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20>(fn1: () => T1, fn2: (arg: T1) => T2, fn3: (arg: T2) => T3, fn4: (arg: T3) => T4, fn5: (arg: T4) => T5, fn6: (arg: T5) => T6, fn7: (arg: T6) => T7, fn8: (arg: T7) => T8, fn9: (arg: T8) => T9, fn10: (arg: T9) => T10, fn11: (arg: T10) => T11, fn12: (arg: T11) => T12, fn13: (arg: T12) => T13, fn14: (arg: T13) => T14, fn15: (arg: T14) => T15, fn16: (arg: T15) => T16, fn17: (arg: T16) => T17, fn18: (arg: T17) => T18, fn19: (arg: T18) => T19, fn20: (arg: T19) => T20): T20
export function pipe(...fns: Fn[]): unknown

export function pipe(...fns: Fn[]) {
    if (!isNonEmptyArray(fns)) {
        return
    }

    let result = fns[0]()

    for (let i = 1; i < fns.length; i++) {
        result = fns[i]!(result)
    }

    return result
}
