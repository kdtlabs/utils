import { tap } from '../functions'
import { type DateLike, DayOfWeek } from './types'

export interface WeekOptions {
    weekStartsOn?: DayOfWeek
}

export const startOfHour = (date: DateLike) => tap(new Date(date), (r) => {
    r.setMinutes(0, 0, 0)
})

export const startOfDay = (date: DateLike) => tap(new Date(date), (r) => {
    r.setHours(0, 0, 0, 0)
})

export const startOfWeek = (date: DateLike, { weekStartsOn = DayOfWeek.MONDAY }: WeekOptions = {}) => tap(new Date(date), (r) => {
    const day = r.getDay()
    const diff = (day - weekStartsOn + 7) % 7

    r.setDate(r.getDate() - diff)
    r.setHours(0, 0, 0, 0)
})

export const startOfMonth = (date: DateLike) => tap(new Date(date), (r) => {
    r.setDate(1)
    r.setHours(0, 0, 0, 0)
})

export const startOfYear = (date: DateLike) => tap(new Date(date), (r) => {
    r.setMonth(0, 1)
    r.setHours(0, 0, 0, 0)
})

export const endOfHour = (date: DateLike) => tap(new Date(date), (r) => {
    r.setMinutes(59, 59, 999)
})

export const endOfDay = (date: DateLike) => tap(new Date(date), (r) => {
    r.setHours(23, 59, 59, 999)
})

export const endOfWeek = (date: DateLike, { weekStartsOn = DayOfWeek.MONDAY }: WeekOptions = {}) => tap(new Date(date), (r) => {
    const day = r.getDay()
    const diff = (6 - day + weekStartsOn + 7) % 7

    r.setDate(r.getDate() + diff)
    r.setHours(23, 59, 59, 999)
})

export const endOfMonth = (date: DateLike) => tap(new Date(date), (r) => {
    r.setMonth(r.getMonth() + 1, 0)
    r.setHours(23, 59, 59, 999)
})

export const endOfYear = (date: DateLike) => tap(new Date(date), (r) => {
    r.setMonth(11, 31)
    r.setHours(23, 59, 59, 999)
})

export type TimeInterval = 'daily' | 'hourly' | 'monthly' | 'weekly' | 'yearly'

export interface ResolveIntervalOptions extends WeekOptions {
    now?: DateLike
}

const START_RESOLVERS: Record<TimeInterval, (date: DateLike, options: WeekOptions) => Date> = {
    daily: (d) => startOfDay(d),
    hourly: (d) => startOfHour(d),
    monthly: (d) => startOfMonth(d),
    weekly: (d, o) => startOfWeek(d, o),
    yearly: (d) => startOfYear(d),
}

const END_RESOLVERS: Record<TimeInterval, (date: DateLike, options: WeekOptions) => Date> = {
    daily: (d) => endOfDay(d),
    hourly: (d) => endOfHour(d),
    monthly: (d) => endOfMonth(d),
    weekly: (d, o) => endOfWeek(d, o),
    yearly: (d) => endOfYear(d),
}

export const resolveInterval = (interval: TimeInterval, type: 'end' | 'start' = 'start', { now = new Date(), ...weekOptions }: ResolveIntervalOptions = {}) => (
    (type === 'start' ? START_RESOLVERS : END_RESOLVERS)[interval](now, weekOptions)
)
