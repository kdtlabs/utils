export const BigIntMath = {
    isEven(a: bigint) {
        return a % 2n === 0n
    },

    isOdd(a: bigint) {
        return a % 2n !== 0n
    },

    divMod(a: bigint, b: bigint): [quotient: bigint, remainder: bigint] {
        if (b === 0n) {
            throw new RangeError('Division by zero')
        }

        return [a / b, a % b]
    },

    abs(a: bigint) {
        return a < 0n ? -a : a
    },

    max(a: bigint, b: bigint) {
        return a > b ? a : b
    },

    min(a: bigint, b: bigint) {
        return a < b ? a : b
    },

    pow(a: bigint, b: bigint) {
        return a ** b
    },

    sign(a: bigint) {
        return a === 0n ? 0n : (a < 0n ? -1n : 1n)
    },

    mod(a: bigint, b: bigint) {
        return ((a % b) + b) % b
    },

    modPow(base: bigint, exponent: bigint, modulus: bigint) {
        if (exponent < 0n) {
            throw new RangeError('Exponent must be non-negative')
        }

        if (modulus === 1n) {
            return 0n
        }

        let result = 1n

        base = BigIntMath.mod(base, modulus)

        while (exponent > 0n) {
            if (exponent % 2n === 1n) {
                result = BigIntMath.mod(result * base, modulus)
            }

            exponent >>= 1n
            base = BigIntMath.mod(base * base, modulus)
        }

        return result
    },

    gcd(a: bigint, b: bigint) {
        a = BigIntMath.abs(a)
        b = BigIntMath.abs(b)

        while (b !== 0n) {
            [a, b] = [b, a % b]
        }

        return a
    },

    lcm(a: bigint, b: bigint) {
        return (a / BigIntMath.gcd(a, b)) * b
    },

    clamp(value: bigint, min: bigint, max: bigint) {
        return BigIntMath.min(BigIntMath.max(value, min), max)
    },

    sqrt(n: bigint) {
        if (n < 0n) {
            throw new RangeError('Square root of negative bigint is undefined')
        }

        if (n < 2n) {
            return n
        }

        let x = n
        let y = (x + 1n) / 2n

        while (y < x) {
            x = y
            y = (x + n / x) / 2n
        }

        return x
    },

    factorial(n: bigint) {
        if (n < 0n) {
            throw new RangeError('Factorial of negative bigint is undefined')
        }

        if (n === 0n) {
            return 1n
        }

        let result = 1n

        for (let i = 1n; i <= n; i++) {
            result *= i
        }

        return result
    },

    sum(array: bigint[]) {
        return array.reduce((a, b) => a + b, 0n)
    },

    avg(array: bigint[]) {
        if (array.length === 0) {
            return 0n
        }

        return BigIntMath.sum(array) / BigInt(array.length)
    },

    isPrime(n: bigint) {
        if (n < 2n) {
            return false
        }

        if (n < 4n) {
            return true
        }

        if (n % 2n === 0n || n % 3n === 0n) {
            return false
        }

        const limit = BigIntMath.sqrt(n)

        for (let i = 5n; i <= limit; i += 6n) {
            if (n % i === 0n || n % (i + 2n) === 0n) {
                return false
            }
        }

        return true
    },

    compare(a: bigint, b: bigint) {
        return a === b ? 0 : (a < b ? -1 : 1)
    },
}
