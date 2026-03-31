import { LinkedSet } from './linked-set'

export class LruSet<T> extends LinkedSet<T> {
    public add(value: T): this {
        const existingNode = this.nodeMap.get(value)

        if (existingNode) {
            this.moveToHead(existingNode)

            return this
        }

        const newNode = this.createNode(value)

        this.nodeMap.set(value, newNode)
        this.addToHead(newNode)
        this.currentSize++

        if (this.maxSize && this.currentSize > this.maxSize) {
            this.removeTail()
        }

        return this
    }
}
