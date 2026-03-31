import { LinkedSet } from './linked-set'

export class FifoSet<T> extends LinkedSet<T> {
    public add(value: T): this {
        if (this.nodeMap.has(value)) {
            return this
        }

        const newNode = this.createNode(value)

        this.nodeMap.set(value, newNode)
        this.addToTail(newNode)
        this.currentSize++

        if (this.maxSize && this.currentSize > this.maxSize) {
            this.removeHead()
        }

        return this
    }

    public override peekOldest(): T | undefined {
        return this.head?.value
    }

    public override peekNewest(): T | undefined {
        return this.tail?.value
    }
}
