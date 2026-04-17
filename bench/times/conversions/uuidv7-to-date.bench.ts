import { bench, do_not_optimize, run, summary } from 'mitata'

function approachSliceConcat(uuid: string) {
    if (uuid.length !== 36 || uuid[14] !== '7') {
        throw new TypeError('Invalid UUIDv7')
    }

    const hex = uuid.slice(0, 8) + uuid.slice(9, 13)
    const ms = Number.parseInt(hex, 16)

    if (!Number.isFinite(ms)) {
        throw new TypeError('Invalid UUIDv7')
    }

    return new Date(ms)
}

function approachReplaceAll(uuid: string) {
    if (uuid.length !== 36 || uuid[14] !== '7') {
        throw new TypeError('Invalid UUIDv7')
    }

    const hex = uuid.replaceAll('-', '').slice(0, 12)
    const ms = Number.parseInt(hex, 16)

    if (!Number.isFinite(ms)) {
        throw new TypeError('Invalid UUIDv7')
    }

    return new Date(ms)
}

function approachManualShift(uuid: string) {
    if (uuid.length !== 36 || uuid[14] !== '7') {
        throw new TypeError('Invalid UUIDv7')
    }

    let ms = 0

    for (let i = 0; i < 13; i++) {
        if (i === 8) {
            continue
        }

        const code = uuid.codePointAt(i)!
        let digit: number

        if (code >= 48 && code <= 57) {
            digit = code - 48
        } else if (code >= 97 && code <= 102) {
            digit = code - 87
        } else if (code >= 65 && code <= 70) {
            digit = code - 55
        } else {
            throw new TypeError('Invalid UUIDv7')
        }

        ms = ms * 16 + digit
    }

    return new Date(ms)
}

const samples = [
    '017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
    '01936d5f-3a2e-7b12-8c0a-1234567890ab',
    '0190abcd-ef01-7fff-bfff-ffffffffffff',
    '00000000-0000-7000-8000-000000000000',
    'ffffffff-ffff-7fff-bfff-ffffffffffff',
    '01925a4e-18cd-7a3e-9f2b-0123456789ab',
]

summary(() => {
    bench('sliceConcat', function* () {
        let i = 0
        yield () => do_not_optimize(approachSliceConcat(samples[i++ % samples.length]!))
    })

    bench('replaceAll', function* () {
        let i = 0
        yield () => do_not_optimize(approachReplaceAll(samples[i++ % samples.length]!))
    })

    bench('manualShift', function* () {
        let i = 0
        yield () => do_not_optimize(approachManualShift(samples[i++ % samples.length]!))
    })
})

await run()
