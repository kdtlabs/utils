import { describe, expect, it } from 'bun:test'
import { BigIntMath } from '@/numbers/bigint-math'

describe('BigIntMath', () => {
    describe('isEven', () => {
        it('returns true for even numbers', () => {
            expect(BigIntMath.isEven(4n)).toBe(true)
        })

        it('returns false for odd numbers', () => {
            expect(BigIntMath.isEven(3n)).toBe(false)
        })

        it('returns true for zero', () => {
            expect(BigIntMath.isEven(0n)).toBe(true)
        })

        it('returns true for negative even numbers', () => {
            expect(BigIntMath.isEven(-4n)).toBe(true)
        })
    })

    describe('isOdd', () => {
        it('returns true for odd numbers', () => {
            expect(BigIntMath.isOdd(3n)).toBe(true)
        })

        it('returns false for even numbers', () => {
            expect(BigIntMath.isOdd(4n)).toBe(false)
        })

        it('returns false for zero', () => {
            expect(BigIntMath.isOdd(0n)).toBe(false)
        })
    })

    describe('divMod', () => {
        it('returns quotient and remainder', () => {
            expect(BigIntMath.divMod(10n, 3n)).toEqual([3n, 1n])
        })

        it('returns exact division with zero remainder', () => {
            expect(BigIntMath.divMod(10n, 5n)).toEqual([2n, 0n])
        })

        it('throws RangeError for division by zero', () => {
            expect(() => BigIntMath.divMod(10n, 0n)).toThrow(RangeError)
        })
    })

    describe('abs', () => {
        it('returns absolute value of negative', () => {
            expect(BigIntMath.abs(-5n)).toBe(5n)
        })

        it('returns positive unchanged', () => {
            expect(BigIntMath.abs(5n)).toBe(5n)
        })

        it('returns zero for zero', () => {
            expect(BigIntMath.abs(0n)).toBe(0n)
        })
    })

    describe('max', () => {
        it('returns the larger value', () => {
            expect(BigIntMath.max(3n, 7n)).toBe(7n)
        })

        it('returns either when equal', () => {
            expect(BigIntMath.max(5n, 5n)).toBe(5n)
        })
    })

    describe('min', () => {
        it('returns the smaller value', () => {
            expect(BigIntMath.min(3n, 7n)).toBe(3n)
        })

        it('returns either when equal', () => {
            expect(BigIntMath.min(5n, 5n)).toBe(5n)
        })
    })

    describe('pow', () => {
        it('calculates power', () => {
            expect(BigIntMath.pow(2n, 10n)).toBe(1024n)
        })

        it('returns 1 for exponent 0', () => {
            expect(BigIntMath.pow(5n, 0n)).toBe(1n)
        })
    })

    describe('sign', () => {
        it('returns 1n for positive', () => {
            expect(BigIntMath.sign(42n)).toBe(1n)
        })

        it('returns -1n for negative', () => {
            expect(BigIntMath.sign(-42n)).toBe(-1n)
        })

        it('returns 0n for zero', () => {
            expect(BigIntMath.sign(0n)).toBe(0n)
        })
    })

    describe('mod', () => {
        it('returns positive modulus', () => {
            expect(BigIntMath.mod(7n, 3n)).toBe(1n)
        })

        it('handles negative dividend', () => {
            expect(BigIntMath.mod(-7n, 3n)).toBe(2n)
        })
    })

    describe('modPow', () => {
        it('calculates modular exponentiation', () => {
            expect(BigIntMath.modPow(2n, 10n, 1000n)).toBe(24n)
        })

        it('returns 0 when modulus is 1', () => {
            expect(BigIntMath.modPow(5n, 3n, 1n)).toBe(0n)
        })

        it('returns 1 when exponent is 0', () => {
            expect(BigIntMath.modPow(5n, 0n, 7n)).toBe(1n)
        })

        it('handles even exponent', () => {
            expect(BigIntMath.modPow(3n, 4n, 5n)).toBe(1n)
        })

        it('throws RangeError for negative exponent', () => {
            expect(() => BigIntMath.modPow(2n, -1n, 5n)).toThrow(RangeError)
        })

        it('works when destructured', () => {
            const { modPow } = BigIntMath
            expect(modPow(2n, 10n, 1000n)).toBe(24n)
        })
    })

    describe('gcd', () => {
        it('calculates greatest common divisor', () => {
            expect(BigIntMath.gcd(12n, 8n)).toBe(4n)
        })

        it('handles negative inputs', () => {
            expect(BigIntMath.gcd(-12n, 8n)).toBe(4n)
        })

        it('returns the other when one is zero', () => {
            expect(BigIntMath.gcd(0n, 5n)).toBe(5n)
        })

        it('works when destructured', () => {
            const { gcd } = BigIntMath
            expect(gcd(12n, 8n)).toBe(4n)
        })
    })

    describe('lcm', () => {
        it('calculates least common multiple', () => {
            expect(BigIntMath.lcm(4n, 6n)).toBe(12n)
        })

        it('returns the value when one divides the other', () => {
            expect(BigIntMath.lcm(3n, 9n)).toBe(9n)
        })

        it('works when destructured', () => {
            const { lcm } = BigIntMath
            expect(lcm(4n, 6n)).toBe(12n)
        })
    })

    describe('clamp', () => {
        it('returns value when within range', () => {
            expect(BigIntMath.clamp(5n, 0n, 10n)).toBe(5n)
        })

        it('clamps to min', () => {
            expect(BigIntMath.clamp(-5n, 0n, 10n)).toBe(0n)
        })

        it('clamps to max', () => {
            expect(BigIntMath.clamp(15n, 0n, 10n)).toBe(10n)
        })

        it('works when destructured', () => {
            const { clamp } = BigIntMath
            expect(clamp(5n, 0n, 10n)).toBe(5n)
        })
    })

    describe('sqrt', () => {
        it('calculates integer square root', () => {
            expect(BigIntMath.sqrt(9n)).toBe(3n)
        })

        it('floors non-perfect squares', () => {
            expect(BigIntMath.sqrt(10n)).toBe(3n)
        })

        it('returns 0 for 0', () => {
            expect(BigIntMath.sqrt(0n)).toBe(0n)
        })

        it('returns 1 for 1', () => {
            expect(BigIntMath.sqrt(1n)).toBe(1n)
        })

        it('throws RangeError for negative input', () => {
            expect(() => BigIntMath.sqrt(-4n)).toThrow(RangeError)
        })
    })

    describe('factorial', () => {
        it('calculates factorial', () => {
            expect(BigIntMath.factorial(5n)).toBe(120n)
        })

        it('returns 1 for 0', () => {
            expect(BigIntMath.factorial(0n)).toBe(1n)
        })

        it('returns 1 for 1', () => {
            expect(BigIntMath.factorial(1n)).toBe(1n)
        })

        it('throws RangeError for negative input', () => {
            expect(() => BigIntMath.factorial(-1n)).toThrow(RangeError)
        })
    })

    describe('sum', () => {
        it('sums an array of bigints', () => {
            expect(BigIntMath.sum([1n, 2n, 3n])).toBe(6n)
        })

        it('returns 0n for an empty array', () => {
            expect(BigIntMath.sum([])).toBe(0n)
        })
    })

    describe('avg', () => {
        it('calculates the average', () => {
            expect(BigIntMath.avg([2n, 4n, 6n])).toBe(4n)
        })

        it('returns 0n for an empty array', () => {
            expect(BigIntMath.avg([])).toBe(0n)
        })

        it('truncates to integer', () => {
            expect(BigIntMath.avg([1n, 2n])).toBe(1n)
        })

        it('works when destructured', () => {
            const { avg } = BigIntMath
            expect(avg([2n, 4n, 6n])).toBe(4n)
        })
    })

    describe('isPrime', () => {
        it('returns false for 0', () => {
            expect(BigIntMath.isPrime(0n)).toBe(false)
        })

        it('returns false for 1', () => {
            expect(BigIntMath.isPrime(1n)).toBe(false)
        })

        it('returns true for 2', () => {
            expect(BigIntMath.isPrime(2n)).toBe(true)
        })

        it('returns true for 3', () => {
            expect(BigIntMath.isPrime(3n)).toBe(true)
        })

        it('returns false for 4', () => {
            expect(BigIntMath.isPrime(4n)).toBe(false)
        })

        it('returns true for 5', () => {
            expect(BigIntMath.isPrime(5n)).toBe(true)
        })

        it('returns false for 6', () => {
            expect(BigIntMath.isPrime(6n)).toBe(false)
        })

        it('returns false for 9', () => {
            expect(BigIntMath.isPrime(9n)).toBe(false)
        })

        it('returns false for 25', () => {
            expect(BigIntMath.isPrime(25n)).toBe(false)
        })

        it('returns false for 49', () => {
            expect(BigIntMath.isPrime(49n)).toBe(false)
        })

        it('returns true for 97', () => {
            expect(BigIntMath.isPrime(97n)).toBe(true)
        })

        it('returns false for 100', () => {
            expect(BigIntMath.isPrime(100n)).toBe(false)
        })

        it('returns false for negative numbers', () => {
            expect(BigIntMath.isPrime(-7n)).toBe(false)
        })

        it('returns true for a large prime', () => {
            expect(BigIntMath.isPrime(7919n)).toBe(true)
        })

        it('works when destructured', () => {
            const { isPrime } = BigIntMath
            expect(isPrime(97n)).toBe(true)
        })
    })

    describe('compare', () => {
        it('returns 0 for equal values', () => {
            expect(BigIntMath.compare(5n, 5n)).toBe(0)
        })

        it('returns -1 when a is less than b', () => {
            expect(BigIntMath.compare(3n, 7n)).toBe(-1)
        })

        it('returns 1 when a is greater than b', () => {
            expect(BigIntMath.compare(7n, 3n)).toBe(1)
        })
    })
})
