export const SERIALIZE = Symbol.for('serialize.custom')

export const GENERATOR_PATTERNS = /\bfunction\s*\*|^async\s+function\s*\*|\*\s*\[|^\*\s/u

export const OMIT_SENTINEL = Symbol('omit')
