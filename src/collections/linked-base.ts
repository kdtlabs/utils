export interface LinkedBaseNode {
    next: LinkedBaseNode | null
    prev: LinkedBaseNode | null
}

export abstract class LinkedBase<NodeKey, N extends LinkedBaseNode> {
    protected readonly nodeMap = new Map<NodeKey, N>()

    protected currentSize = 0
    protected head: N | null = null
    protected tail: N | null = null

    public constructor(public readonly maxSize?: number) {
        if (maxSize != null && (maxSize < 1 || !Number.isInteger(maxSize))) {
            throw new RangeError('maxSize must be a positive integer')
        }
    }

    public get size() {
        return this.currentSize
    }

    public get [Symbol.toStringTag]() {
        return this.constructor.name
    }

    public clear() {
        this.nodeMap.clear()
        this.head = null
        this.tail = null
        this.currentSize = 0
    }

    protected abstract getNodeKey(node: N): NodeKey

    protected addToHead(node: N) {
        node.prev = null
        node.next = this.head

        if (this.head) {
            this.head.prev = node
        } else {
            this.tail = node
        }

        this.head = node
    }

    protected addToTail(node: N) {
        node.next = null
        node.prev = this.tail

        if (this.tail) {
            this.tail.next = node
        } else {
            this.head = node
        }

        this.tail = node
    }

    protected deleteByKey(key: NodeKey) {
        const node = this.nodeMap.get(key)

        if (!node) {
            return false
        }

        this.nodeMap.delete(key)
        this.removeNode(node)
        this.currentSize--

        return true
    }

    protected moveToHead(node: N) {
        this.removeNode(node)
        this.addToHead(node)
    }

    protected removeHead() {
        if (!this.head) {
            return
        }

        this.nodeMap.delete(this.getNodeKey(this.head))
        this.removeNode(this.head)
        this.currentSize--
    }

    protected removeNode(node: N) {
        if (node.prev) {
            node.prev.next = node.next
        } else {
            this.head = node.next as N | null
        }

        if (node.next) {
            node.next.prev = node.prev
        } else {
            this.tail = node.prev as N | null
        }

        node.prev = null
        node.next = null
    }

    protected removeTail() {
        if (!this.tail) {
            return
        }

        this.nodeMap.delete(this.getNodeKey(this.tail))
        this.removeNode(this.tail)
        this.currentSize--
    }
}
