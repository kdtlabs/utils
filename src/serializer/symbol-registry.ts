export function createSymbolKeySerializer() {
    const cache = new Map<symbol, string>()
    const usedKeys = new Set<string>()

    let counter = 0

    return (symbol: symbol): string => {
        const cached = cache.get(symbol)

        if (cached !== undefined) {
            return cached
        }

        const desc = symbol.description
        const base = desc?.length ? desc : `@@${++counter}`

        let key = `[Symbol(${base})]`

        while (usedKeys.has(key)) {
            key = `[Symbol(${base}@@${++counter})]`
        }

        usedKeys.add(key)
        cache.set(symbol, key)

        return key
    }
}
