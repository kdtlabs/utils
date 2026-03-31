import { toUnixTimestamp } from './conversions'

export const timestamp = () => toUnixTimestamp(new Date())
