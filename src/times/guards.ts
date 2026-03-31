export const isValidDate = (value: unknown): value is Date => (
    value instanceof Date && !Number.isNaN(value.getTime())
)
