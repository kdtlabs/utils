export type EventMap = Record<PropertyKey, any[]>

export type EventNames<TEventMap, TStrict extends boolean> = TStrict extends true ? keyof TEventMap | '*' : keyof TEventMap | string

export type ResolveEventArgs<TEventMap, TEventName> = TEventName extends keyof TEventMap ? TEventMap[TEventName] extends any[] ? TEventMap[TEventName] : any[] : any[]

export type WildcardArgs<TEventMap, TStrict extends boolean> = [eventName: EventNames<TEventMap, TStrict>, ...args: any[]]

export type EventArgs<TEventMap, TEventName, TStrict extends boolean> = TEventName extends '*' ? WildcardArgs<TEventMap, TStrict> : TStrict extends true ? TEventName extends keyof TEventMap ? ResolveEventArgs<TEventMap, TEventName> : never : ResolveEventArgs<TEventMap, TEventName>

export type EventListener<TArgs = any[]> = (...args: TArgs extends any[] ? TArgs : any[]) => void

export type EventListenerMap = Map<PropertyKey, Set<EventListener>>
