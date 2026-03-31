import { tap } from '@/functions'

export const startOfDay = (date: Date) => tap(new Date(date), (r) => {
    r.setHours(0, 0, 0, 0)
})

export const endOfDay = (date: Date) => tap(new Date(date), (r) => {
    r.setHours(23, 59, 59, 999)
})
