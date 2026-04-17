interface QuantifierInfo {
    len: number
    unbounded: boolean
}

interface GroupFrame {
    hasUnbounded: boolean
}

const isDigit = (c: string | undefined) => c !== undefined && c >= '0' && c <= '9'

function readBraceQuantifier(source: string, i: number): QuantifierInfo | null {
    let j = i + 1

    if (!isDigit(source[j])) {
        return null
    }

    while (isDigit(source[j])) {
        j++
    }

    let hasComma = false
    let hasMax = false

    if (source[j] === ',') {
        hasComma = true
        j++

        while (isDigit(source[j])) {
            hasMax = true
            j++
        }
    }

    if (source[j] !== '}') {
        return null
    }

    j++

    if (source[j] === '?') {
        j++
    }

    return { len: j - i, unbounded: hasComma && !hasMax }
}

function readQuantifier(source: string, i: number): QuantifierInfo | null {
    const c = source[i]

    if (c === '*' || c === '+') {
        return { len: source[i + 1] === '?' ? 2 : 1, unbounded: true }
    }

    if (c === '?') {
        return { len: source[i + 1] === '?' ? 2 : 1, unbounded: false }
    }

    if (c === '{') {
        return readBraceQuantifier(source, i)
    }

    return null
}

function skipCharClass(source: string, i: number) {
    const len = source.length

    let j = i + 1

    while (j < len && source[j] !== ']') {
        if (source[j] === '\\') {
            j++
        }

        j++
    }

    return j + 1
}

function skipGroupPrefix(source: string, i: number) {
    if (source[i] !== '?') {
        return i
    }

    const len = source.length

    let j = i + 1

    while (j < len && source[j] !== ':' && source[j] !== '>' && source[j] !== '(' && source[j] !== ')') {
        j++
    }

    if (source[j] === ':' || source[j] === '>') {
        j++
    }

    return j
}

function handleGroupClose(source: string, i: number, stack: GroupFrame[]) {
    const closed = stack.pop()!
    const parent = stack.at(-1)!
    const q = readQuantifier(source, i)

    let next = i
    let unsafe = false

    if (q) {
        next += q.len

        if (q.unbounded && closed.hasUnbounded) {
            unsafe = true
        }

        if (q.unbounded) {
            parent.hasUnbounded = true
        }
    }

    if (closed.hasUnbounded) {
        parent.hasUnbounded = true
    }

    return { next, unsafe }
}

function detectReDoS(source: string) {
    const stack: GroupFrame[] = [{ hasUnbounded: false }]
    const len = source.length

    let i = 0

    while (i < len) {
        const c = source[i]

        if (c === '\\') {
            i += 2
            continue
        }

        if (c === '[') {
            i = skipCharClass(source, i)
            continue
        }

        if (c === '(') {
            i = skipGroupPrefix(source, i + 1)
            stack.push({ hasUnbounded: false })
            continue
        }

        if (c === ')') {
            const result = handleGroupClose(source, i + 1, stack)

            if (result.unsafe) {
                return true
            }

            i = result.next
            continue
        }

        const q = readQuantifier(source, i)

        if (q) {
            if (q.unbounded) {
                stack.at(-1)!.hasUnbounded = true
            }

            i += q.len
            continue
        }

        i++
    }

    return false
}

export function createSafeRegex(source: RegExp | string, flags?: string) {
    const pattern = source instanceof RegExp ? source.source : source
    const effectiveFlags = flags ?? (source instanceof RegExp ? source.flags : undefined)

    if (detectReDoS(pattern)) {
        throw new Error(`Potentially vulnerable to ReDoS: /${pattern}/`)
    }

    return new RegExp(pattern, effectiveFlags)
}
