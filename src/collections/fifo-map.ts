import { LinkedMap } from './linked-map'

export class FifoMap<K, V> extends LinkedMap<K, V> {
    public override peekNewest(): [K, V] | undefined {
        return this.tail ? [this.tail.key, this.tail.value] : undefined
    }

    public override peekOldest(): [K, V] | undefined {
        return this.head ? [this.head.key, this.head.value] : undefined
    }

    public set(key: K, value: V): this {
        const existingNode = this.nodeMap.get(key)

        if (existingNode) {
            existingNode.value = value

            return this
        }

        const newNode = this.createNode(key, value)

        this.nodeMap.set(key, newNode)
        this.addToTail(newNode)
        this.currentSize++

        if (this.maxSize && this.currentSize > this.maxSize) {
            this.removeHead()
        }

        return this
    }
}
