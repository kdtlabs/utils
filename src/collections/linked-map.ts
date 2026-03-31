import type { MapLike } from './types'
import { LinkedBase, type LinkedBaseNode } from './linked-base'

export interface LinkedMapNode<K, V> extends LinkedBaseNode {
    key: K
    next: LinkedMapNode<K, V> | null
    prev: LinkedMapNode<K, V> | null
    value: V
}

export abstract class LinkedMap<K, V> extends LinkedBase<K, LinkedMapNode<K, V>> implements MapLike<K, V> {
    public delete(key: K) {
        return this.deleteByKey(key)
    }

    public * entries(): IterableIterator<[K, V]> {
        let current = this.head

        while (current) {
            yield [current.key, current.value]
            current = current.next
        }
    }

    public forEach(callback: (value: V, key: K, map: this) => void) {
        for (const [key, value] of this.entries()) {
            callback(value, key, this)
        }
    }

    public get(key: K) {
        return this.nodeMap.get(key)?.value
    }

    public has(key: K) {
        return this.nodeMap.has(key)
    }

    public * keys(): IterableIterator<K> {
        let current = this.head

        while (current) {
            yield current.key
            current = current.next
        }
    }

    public peekNewest(): [K, V] | undefined {
        return this.head ? [this.head.key, this.head.value] : undefined
    }

    public peekOldest(): [K, V] | undefined {
        return this.tail ? [this.tail.key, this.tail.value] : undefined
    }

    public abstract set(key: K, value: V): this

    public [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries()
    }

    public toJSON(): Array<[K, V]> {
        return [...this.entries()]
    }

    public * values(): IterableIterator<V> {
        let current = this.head

        while (current) {
            yield current.value
            current = current.next
        }
    }

    protected createNode(key: K, value: V): LinkedMapNode<K, V> {
        return { key, next: null, prev: null, value }
    }

    protected getNodeKey(node: LinkedMapNode<K, V>) {
        return node.key
    }
}
