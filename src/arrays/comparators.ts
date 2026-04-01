export type StringSortType = 'alphabetical' | 'length' | 'natural'

type Sortable = bigint | number | string

const COLLATOR_NATURAL = new Intl.Collator(undefined, { numeric: true, sensitivity: 'variant' })

function createStringComparator(direction: -1 | 1, type: StringSortType) {
    if (type === 'natural') {
        const cmp = COLLATOR_NATURAL.compare

        return (a: string, b: string) => direction * cmp(a, b)
    }

    if (type === 'length') {
        return (a: string, b: string) => direction * (a.length - b.length)
    }

    return (a: string, b: string) => direction * a.localeCompare(b)
}

const createGenericComparator = (direction: -1 | 1) => <T extends Sortable>(a: T, b: T) => {
    if (a < b) {
        return -direction as -1 | 1
    }

    if (a > b) {
        return direction
    }

    return 0 as const
}

export function asc(type: StringSortType): (a: string, b: string) => number
export function asc(): <T extends Sortable>(a: T, b: T) => number

export function asc(type?: StringSortType) {
    if (type) {
        return createStringComparator(1, type)
    }

    return createGenericComparator(1)
}

export function desc(type: StringSortType): (a: string, b: string) => number
export function desc(): <T extends Sortable>(a: T, b: T) => number

export function desc(type?: StringSortType) {
    if (type) {
        return createStringComparator(-1, type)
    }

    return createGenericComparator(-1)
}
