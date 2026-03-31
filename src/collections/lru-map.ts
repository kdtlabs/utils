import { LinkedMap } from './linked-map'

export class LruMap<K, V> extends LinkedMap<K, V> {
    public override get(key: K) {
        const node = this.nodeMap.get(key)

        if (node) {
            this.moveToHead(node)
        }

        return node?.value
    }

    public set(key: K, value: V): this {
        const existingNode = this.nodeMap.get(key)

        if (existingNode) {
            existingNode.value = value
            this.moveToHead(existingNode)

            return this
        }

        const newNode = this.createNode(key, value)

        this.nodeMap.set(key, newNode)
        this.addToHead(newNode)
        this.currentSize++

        if (this.maxSize && this.currentSize > this.maxSize) {
            this.removeTail()
        }

        return this
    }
}
