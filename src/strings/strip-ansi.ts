// eslint-disable-next-line no-control-regex, regexp/no-control-character, sonarjs/no-control-regex -- ANSI stripping requires matching control characters
const ANSI_REGEX = /\u001B(?:\[[\d;]*[A-Za-z]|\].*?(?:\u0007|\u001B\\)|\([A-Za-z]|[A-Z])/gu

export function stripAnsi(str: string) {
    ANSI_REGEX.lastIndex = 0

    if (!ANSI_REGEX.test(str)) {
        return str
    }

    ANSI_REGEX.lastIndex = 0

    return str.replace(ANSI_REGEX, '')
}
