import { createDeferred, type DeferredPromise } from './deferred'

export class AsyncChannel<T> {
    readonly #buffer: T[] = []

    #waiter: DeferredPromise<void> | null = null
    #closed = false

    public push(...values: T[]) {
        if (this.#closed) {
            return
        }

        this.#buffer.push(...values)
        this.#waiter?.resolve()
    }

    public close() {
        this.#closed = true
        this.#waiter?.resolve()
    }

    public async * [Symbol.asyncIterator](): AsyncGenerator<T> {
        while (true) {
            while (this.#buffer.length > 0) {
                yield this.#buffer.shift()!
            }

            if (this.#closed) {
                return
            }

            this.#waiter = createDeferred<void>()

            await this.#waiter

            this.#waiter = null
        }
    }
}
