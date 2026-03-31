import type { SetLike } from './types'
import { LinkedBase, type LinkedBaseNode } from './linked-base'

export interface LinkedSetNode<T> extends LinkedBaseNode {
    next: LinkedSetNode<T> | null
    prev: LinkedSetNode<T> | null
    value: T
}

export abstract class LinkedSet<T> extends LinkedBase<T, LinkedSetNode<T>> implements SetLike<T> {
    public abstract add(value: T): this

    public delete(value: T) {
        return this.deleteByKey(value)
    }

    public * entries(): IterableIterator<[T, T]> {
        for (const value of this.values()) {
            yield [value, value]
        }
    }

    public forEach(callback: (value: T, value2: T, set: this) => void) {
        for (const value of this.values()) {
            callback(value, value, this)
        }
    }

    public has(value: T) {
        return this.nodeMap.has(value)
    }

    public keys() {
        return this.values()
    }

    public peekNewest(): T | undefined {
        return this.head?.value
    }

    public peekOldest(): T | undefined {
        return this.tail?.value
    }

    public [Symbol.iterator]() {
        return this.values()
    }

    public toJSON(): T[] {
        return [...this.values()]
    }

    public * values(): IterableIterator<T> {
        let current = this.head

        while (current) {
            yield current.value
            current = current.next
        }
    }

    protected createNode(value: T): LinkedSetNode<T> {
        return { next: null, prev: null, value }
    }

    protected getNodeKey(node: LinkedSetNode<T>) {
        return node.value
    }
}
