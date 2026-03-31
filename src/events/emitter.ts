import type { EventArgs, EventListener, EventListenerMap, EventMap, EventNames } from './types'

export class Emitter<TEventMap = EventMap, TStrict extends boolean = false> {
    protected readonly eventListeners: EventListenerMap
    protected readonly onceListeners: EventListenerMap

    public constructor() {
        this.eventListeners = new Map()
        this.onceListeners = new Map()
    }

    public listeners<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName): Array<EventListener<EventArgs<TEventMap, TEventName, TStrict>>> {
        const listeners = this.eventListeners.get(eventName) ?? []
        const onceListeners = this.onceListeners.get(eventName) ?? []

        return [...listeners, ...onceListeners]
    }

    public listenersCount<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName) {
        const listeners = this.eventListeners.get(eventName)
        const onceListeners = this.onceListeners.get(eventName)

        return (listeners?.size ?? 0) + (onceListeners?.size ?? 0)
    }

    public eventNames(): Array<PropertyKey | keyof TEventMap> {
        return [...new Set([...this.eventListeners.keys(), ...this.onceListeners.keys()])]
    }

    public on<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName, listener: EventListener<EventArgs<TEventMap, TEventName, TStrict>>): this {
        this.#addTo(this.eventListeners, eventName, listener)

        return this
    }

    public once<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName, listener: EventListener<EventArgs<TEventMap, TEventName, TStrict>>): this {
        this.#addTo(this.onceListeners, eventName, listener)

        return this
    }

    public off<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName, listener: EventListener<EventArgs<TEventMap, TEventName, TStrict>>): this {
        this.#removeFrom(this.eventListeners, eventName, listener)
        this.#removeFrom(this.onceListeners, eventName, listener)

        return this
    }

    public emit<TEventName extends EventNames<TEventMap, TStrict>>(eventName: TEventName, ...args: EventArgs<TEventMap, TEventName, TStrict>): boolean {
        const regularSnapshot = this.#takeSnapshot(this.eventListeners.get(eventName))
        const onceSnapshot = this.#takeSnapshot(this.onceListeners.get(eventName))

        this.onceListeners.delete(eventName)

        const fromRegular = this.#emitSnapshot(regularSnapshot, args)
        const fromOnce = this.#emitSnapshot(onceSnapshot, args)

        return fromRegular || fromOnce
    }

    public removeAllListeners<TEventName extends EventNames<TEventMap, TStrict>>(eventName?: TEventName): this {
        if (eventName === undefined) {
            this.eventListeners.clear()
            this.onceListeners.clear()
        } else {
            this.eventListeners.delete(eventName)
            this.onceListeners.delete(eventName)
        }

        return this
    }

    #addTo(map: EventListenerMap, eventName: PropertyKey, listener: EventListener) {
        let set = map.get(eventName)

        if (!set) {
            set = new Set()
            map.set(eventName, set)
        }

        set.add(listener)
    }

    #removeFrom(map: EventListenerMap, eventName: PropertyKey, listener: EventListener) {
        const set = map.get(eventName)

        if (!set) {
            return
        }

        set.delete(listener)

        if (set.size === 0) {
            map.delete(eventName)
        }
    }

    #takeSnapshot(set: Set<EventListener> | undefined) {
        if (!set || set.size === 0) {
            return []
        }

        return [...set]
    }

    #emitSnapshot(snapshot: EventListener[], args: any[]) {
        if (snapshot.length === 0) {
            return false
        }

        for (const listener of snapshot) {
            listener(...args)
        }

        return true
    }
}
