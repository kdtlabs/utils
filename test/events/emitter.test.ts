import { describe, expect, it } from 'bun:test'
import { Emitter } from '@/events/emitter'

describe('Emitter', () => {
    describe('on', () => {
        it('registers a listener for an event', () => {
            const emitter = new Emitter()
            const calls: string[] = []

            emitter.on('test', () => {
                calls.push('called')
            })

            emitter.emit('test')

            expect(calls).toEqual(['called'])
        })

        it('returns this for chaining', () => {
            const emitter = new Emitter()

            const result = emitter.on('test', () => {})

            expect(result).toBe(emitter)
        })

        it('supports chaining multiple on calls', () => {
            const emitter = new Emitter()
            const calls: string[] = []

            emitter
                .on('a', () => {
                    calls.push('a')
                })
                .on('b', () => {
                    calls.push('b')
                })

            emitter.emit('a')
            emitter.emit('b')

            expect(calls).toEqual(['a', 'b'])
        })

        it('registers multiple listeners for the same event', () => {
            const emitter = new Emitter()
            const calls: number[] = []

            emitter.on('test', () => {
                calls.push(1)
            })

            emitter.on('test', () => {
                calls.push(2)
            })

            emitter.emit('test')

            expect(calls).toEqual([1, 2])
        })

        it('does not add the same listener reference twice', () => {
            const emitter = new Emitter()
            const calls: number[] = []

            const listener = () => {
                calls.push(1)
            }

            emitter.on('test', listener)
            emitter.on('test', listener)
            emitter.emit('test')

            expect(calls).toEqual([1])
        })

        it('passes arguments to the listener', () => {
            const emitter = new Emitter()
            const received: unknown[] = []

            emitter.on('test', (a: number, b: string) => {
                received.push(a, b)
            })

            emitter.emit('test', 42, 'hello')

            expect(received).toEqual([42, 'hello'])
        })

        it('persists listener across multiple emits', () => {
            const emitter = new Emitter()
            let count = 0

            emitter.on('test', () => {
                count++
            })

            emitter.emit('test')
            emitter.emit('test')
            emitter.emit('test')

            expect(count).toBe(3)
        })
    })

    describe('once', () => {
        it('registers a listener that fires only once', () => {
            const emitter = new Emitter()
            let count = 0

            emitter.once('test', () => {
                count++
            })

            emitter.emit('test')
            emitter.emit('test')

            expect(count).toBe(1)
        })

        it('returns this for chaining', () => {
            const emitter = new Emitter()

            const result = emitter.once('test', () => {})

            expect(result).toBe(emitter)
        })

        it('passes arguments to the once listener', () => {
            const emitter = new Emitter()
            const received: unknown[] = []

            emitter.once('test', (a: number, b: string) => {
                received.push(a, b)
            })

            emitter.emit('test', 1, 'x')

            expect(received).toEqual([1, 'x'])
        })

        it('does not add the same once listener reference twice', () => {
            const emitter = new Emitter()
            let count = 0

            const listener = () => {
                count++
            }

            emitter.once('test', listener)
            emitter.once('test', listener)
            emitter.emit('test')

            expect(count).toBe(1)
        })
    })

    describe('off', () => {
        it('removes a registered on listener', () => {
            const emitter = new Emitter()
            let count = 0

            const listener = () => {
                count++
            }

            emitter.on('test', listener)
            emitter.off('test', listener)
            emitter.emit('test')

            expect(count).toBe(0)
        })

        it('removes a registered once listener', () => {
            const emitter = new Emitter()
            let count = 0

            const listener = () => {
                count++
            }

            emitter.once('test', listener)
            emitter.off('test', listener)
            emitter.emit('test')

            expect(count).toBe(0)
        })

        it('returns this for chaining', () => {
            const emitter = new Emitter()

            const result = emitter.off('test', () => {})

            expect(result).toBe(emitter)
        })

        it('does nothing when removing a non-existent listener', () => {
            const emitter = new Emitter()
            let count = 0

            const listenerA = () => {
                count++
            }

            const listenerB = () => {}

            emitter.on('test', listenerA)
            emitter.off('test', listenerB)
            emitter.emit('test')

            expect(count).toBe(1)
        })

        it('does nothing when event has no listeners', () => {
            const emitter = new Emitter()

            expect(() => {
                emitter.off('nonexistent', () => {})
            }).not.toThrow()
        })

        it('removes only the specified listener', () => {
            const emitter = new Emitter()
            const calls: number[] = []

            const listenerA = () => {
                calls.push(1)
            }

            const listenerB = () => {
                calls.push(2)
            }

            emitter.on('test', listenerA)
            emitter.on('test', listenerB)
            emitter.off('test', listenerA)
            emitter.emit('test')

            expect(calls).toEqual([2])
        })

        it('cleans up internal map when last listener is removed', () => {
            const emitter = new Emitter()
            const listener = () => {}

            emitter.on('test', listener)
            emitter.off('test', listener)

            expect(emitter.eventNames()).toEqual([])
        })
    })

    describe('emit', () => {
        it('returns true when listeners exist', () => {
            const emitter = new Emitter()

            emitter.on('test', () => {})

            expect(emitter.emit('test')).toBe(true)
        })

        it('returns false when no listeners exist', () => {
            const emitter = new Emitter()

            expect(emitter.emit('test')).toBe(false)
        })

        it('returns true for once listeners on first emit', () => {
            const emitter = new Emitter()

            emitter.once('test', () => {})

            expect(emitter.emit('test')).toBe(true)
        })

        it('returns false for once listeners on second emit', () => {
            const emitter = new Emitter()

            emitter.once('test', () => {})
            emitter.emit('test')

            expect(emitter.emit('test')).toBe(false)
        })

        it('calls on listeners before once listeners', () => {
            const emitter = new Emitter()
            const order: string[] = []

            emitter.once('test', () => {
                order.push('once')
            })

            emitter.on('test', () => {
                order.push('on')
            })

            emitter.emit('test')

            expect(order).toEqual(['on', 'once'])
        })

        it('does not affect listeners of other events', () => {
            const emitter = new Emitter()
            let called = false

            emitter.on('other', () => {
                called = true
            })

            emitter.emit('test')

            expect(called).toBe(false)
        })

        it('snapshots on listeners before calling them', () => {
            const emitter = new Emitter()
            const calls: number[] = []

            const listener = () => {
                calls.push(1)
                emitter.off('test', listener)
            }

            emitter.on('test', listener)

            emitter.on('test', () => {
                calls.push(2)
            })

            emitter.emit('test')

            expect(calls).toEqual([1, 2])
        })

        it('does not fire once listeners twice on re-entrant emit', () => {
            const emitter = new Emitter()
            let onceCount = 0

            emitter.once('test', () => {
                onceCount++
                emitter.emit('test')
            })

            emitter.emit('test')

            expect(onceCount).toBe(1)
        })

        it('handles re-entrant emit with on listeners correctly', () => {
            const emitter = new Emitter()
            const calls: number[] = []
            let depth = 0

            emitter.on('test', () => {
                depth++
                calls.push(depth)

                if (depth === 1) {
                    emitter.emit('test')
                }
            })

            emitter.emit('test')

            expect(calls).toEqual([1, 2])
        })
    })

    describe('listeners', () => {
        it('returns an empty array when no listeners exist', () => {
            const emitter = new Emitter()

            expect(emitter.listeners('test')).toEqual([])
        })

        it('returns on listeners', () => {
            const emitter = new Emitter()
            const listener = () => {}

            emitter.on('test', listener)

            expect(emitter.listeners('test')).toEqual([listener])
        })

        it('returns once listeners', () => {
            const emitter = new Emitter()
            const listener = () => {}

            emitter.once('test', listener)

            expect(emitter.listeners('test')).toEqual([listener])
        })

        it('returns both on and once listeners combined', () => {
            const emitter = new Emitter()
            const listenerA = () => {}
            const listenerB = () => {}

            emitter.on('test', listenerA)
            emitter.once('test', listenerB)

            expect(emitter.listeners('test')).toEqual([listenerA, listenerB])
        })

        it('returns a new array each time', () => {
            const emitter = new Emitter()

            emitter.on('test', () => {})

            const a = emitter.listeners('test')
            const b = emitter.listeners('test')

            expect(a).toEqual(b)
            expect(a).not.toBe(b)
        })
    })

    describe('listenersCount', () => {
        it('returns 0 when no listeners exist', () => {
            const emitter = new Emitter()

            expect(emitter.listenersCount('test')).toBe(0)
        })

        it('counts on listeners', () => {
            const emitter = new Emitter()

            emitter.on('test', () => {})
            emitter.on('test', () => {})

            expect(emitter.listenersCount('test')).toBe(2)
        })

        it('counts once listeners', () => {
            const emitter = new Emitter()

            emitter.once('test', () => {})

            expect(emitter.listenersCount('test')).toBe(1)
        })

        it('counts both on and once listeners', () => {
            const emitter = new Emitter()

            emitter.on('test', () => {})
            emitter.once('test', () => {})

            expect(emitter.listenersCount('test')).toBe(2)
        })

        it('returns 0 after all listeners are removed', () => {
            const emitter = new Emitter()
            const listener = () => {}

            emitter.on('test', listener)
            emitter.off('test', listener)

            expect(emitter.listenersCount('test')).toBe(0)
        })

        it('decreases after once listener fires', () => {
            const emitter = new Emitter()

            emitter.on('test', () => {})
            emitter.once('test', () => {})

            expect(emitter.listenersCount('test')).toBe(2)

            emitter.emit('test')

            expect(emitter.listenersCount('test')).toBe(1)
        })
    })

    describe('eventNames', () => {
        it('returns an empty array for a fresh emitter', () => {
            const emitter = new Emitter()

            expect(emitter.eventNames()).toEqual([])
        })

        it('returns names of events with on listeners', () => {
            const emitter = new Emitter()

            emitter.on('a', () => {})
            emitter.on('b', () => {})

            expect(emitter.eventNames()).toEqual(['a', 'b'])
        })

        it('returns names of events with once listeners', () => {
            const emitter = new Emitter()

            emitter.once('x', () => {})

            expect(emitter.eventNames()).toEqual(['x'])
        })

        it('deduplicates event names from on and once', () => {
            const emitter = new Emitter()

            emitter.on('test', () => {})
            emitter.once('test', () => {})

            expect(emitter.eventNames()).toEqual(['test'])
        })

        it('supports Symbol event names', () => {
            const emitter = new Emitter()
            const sym = Symbol('event')

            emitter.on(sym, () => {})

            expect(emitter.eventNames()).toEqual([sym])
        })

        it('removes event name when all listeners are removed', () => {
            const emitter = new Emitter()
            const listener = () => {}

            emitter.on('test', listener)
            emitter.off('test', listener)

            expect(emitter.eventNames()).toEqual([])
        })
    })

    describe('removeAllListeners', () => {
        it('removes all listeners for a specific event', () => {
            const emitter = new Emitter()

            emitter.on('test', () => {})
            emitter.once('test', () => {})
            emitter.on('other', () => {})
            emitter.removeAllListeners('test')

            expect(emitter.listenersCount('test')).toBe(0)
            expect(emitter.listenersCount('other')).toBe(1)
        })

        it('removes all listeners for all events when no argument', () => {
            const emitter = new Emitter()

            emitter.on('a', () => {})
            emitter.on('b', () => {})
            emitter.once('c', () => {})
            emitter.removeAllListeners()

            expect(emitter.eventNames()).toEqual([])
        })

        it('returns this for chaining', () => {
            const emitter = new Emitter()

            const result = emitter.removeAllListeners()

            expect(result).toBe(emitter)
        })

        it('is safe to call on an event with no listeners', () => {
            const emitter = new Emitter()

            expect(() => {
                emitter.removeAllListeners('nonexistent')
            }).not.toThrow()
        })

        it('is safe to call on a fresh emitter', () => {
            const emitter = new Emitter()

            expect(() => {
                emitter.removeAllListeners()
            }).not.toThrow()
        })
    })

    describe('event name types', () => {
        it('supports string event names', () => {
            const emitter = new Emitter()
            let called = false

            emitter.on('click', () => {
                called = true
            })

            emitter.emit('click')

            expect(called).toBe(true)
        })

        it('supports Symbol event names', () => {
            const emitter = new Emitter()
            const sym = Symbol('myEvent')
            let called = false

            emitter.on(sym, () => {
                called = true
            })

            emitter.emit(sym)

            expect(called).toBe(true)
        })

        it('treats different strings as different events', () => {
            const emitter = new Emitter()
            const calls: string[] = []

            emitter.on('a', () => {
                calls.push('a')
            })

            emitter.on('b', () => {
                calls.push('b')
            })

            emitter.emit('a')

            expect(calls).toEqual(['a'])
        })

        it('treats different Symbols as different events', () => {
            const emitter = new Emitter()
            const sym1 = Symbol('event')
            const sym2 = Symbol('event')
            const calls: number[] = []

            emitter.on(sym1, () => {
                calls.push(1)
            })

            emitter.on(sym2, () => {
                calls.push(2)
            })

            emitter.emit(sym1)

            expect(calls).toEqual([1])
        })
    })

    describe('typed emitter', () => {
        it('works with a strict typed event map', () => {
            type Events = {
                count: [n: number]
                greet: [name: string]
            }

            const emitter = new Emitter<Events, true>()
            const received: unknown[] = []

            emitter.on('greet', (name) => {
                received.push(name)
            })

            emitter.on('count', (n) => {
                received.push(n)
            })

            emitter.emit('greet', 'world')
            emitter.emit('count', 42)

            expect(received).toEqual(['world', 42])
        })

        it('works with non-strict mode (default)', () => {
            type Events = {
                known: [value: string]
            }

            const emitter = new Emitter<Events>()
            const calls: string[] = []

            emitter.on('known', (v) => {
                calls.push(v)
            })

            emitter.on('anything', () => {
                calls.push('dynamic')
            })

            emitter.emit('known', 'hello')
            emitter.emit('anything')

            expect(calls).toEqual(['hello', 'dynamic'])
        })
    })

    describe('interleaved operations', () => {
        it('on then once then off the on listener', () => {
            const emitter = new Emitter()
            const calls: string[] = []

            const onListener = () => {
                calls.push('on')
            }

            emitter.on('test', onListener)

            emitter.once('test', () => {
                calls.push('once')
            })

            emitter.off('test', onListener)
            emitter.emit('test')

            expect(calls).toEqual(['once'])
        })

        it('emit after removeAllListeners does nothing', () => {
            const emitter = new Emitter()
            let count = 0

            emitter.on('test', () => {
                count++
            })

            emitter.removeAllListeners()

            expect(emitter.emit('test')).toBe(false)
            expect(count).toBe(0)
        })

        it('can re-register listeners after removeAllListeners', () => {
            const emitter = new Emitter()
            let count = 0

            emitter.on('test', () => {
                count++
            })

            emitter.removeAllListeners()

            emitter.on('test', () => {
                count++
            })

            emitter.emit('test')

            expect(count).toBe(1)
        })

        it('listener that adds a new on listener for the same event', () => {
            const emitter = new Emitter()
            const calls: number[] = []

            emitter.on('test', () => {
                calls.push(1)

                emitter.on('test', () => {
                    calls.push(2)
                })
            })

            emitter.emit('test')

            expect(calls).toEqual([1])

            emitter.emit('test')

            expect(calls).toEqual([1, 1, 2])
        })

        it('listener that removes all listeners for the same event', () => {
            const emitter = new Emitter()
            const calls: number[] = []

            emitter.on('test', () => {
                calls.push(1)
                emitter.removeAllListeners('test')
            })

            emitter.on('test', () => {
                calls.push(2)
            })

            emitter.emit('test')

            expect(calls).toEqual([1, 2])
            expect(emitter.emit('test')).toBe(false)
        })

        it('multiple once listeners for the same event all fire once', () => {
            const emitter = new Emitter()
            const calls: number[] = []

            emitter.once('test', () => {
                calls.push(1)
            })

            emitter.once('test', () => {
                calls.push(2)
            })

            emitter.emit('test')
            emitter.emit('test')

            expect(calls).toEqual([1, 2])
        })

        it('mixing on and once for different events', () => {
            const emitter = new Emitter()
            const calls: string[] = []

            emitter.on('a', () => {
                calls.push('a-on')
            })

            emitter.once('b', () => {
                calls.push('b-once')
            })

            emitter.emit('a')
            emitter.emit('b')
            emitter.emit('a')
            emitter.emit('b')

            expect(calls).toEqual(['a-on', 'b-once', 'a-on'])
        })
    })

    describe('edge cases', () => {
        it('emit with no arguments', () => {
            const emitter = new Emitter()
            let called = false

            emitter.on('test', () => {
                called = true
            })

            emitter.emit('test')

            expect(called).toBe(true)
        })

        it('emit with many arguments', () => {
            const emitter = new Emitter()
            const received: unknown[] = []

            emitter.on('test', (a: number, b: string, c: boolean, d: object) => {
                received.push(a, b, c, d)
            })

            emitter.emit('test', 1, 'two', true, { four: 4 })

            expect(received).toEqual([1, 'two', true, { four: 4 }])
        })

        it('empty string as event name', () => {
            const emitter = new Emitter()
            let called = false

            emitter.on('', () => {
                called = true
            })

            emitter.emit('')

            expect(called).toBe(true)
        })

        it('numeric string as event name', () => {
            const emitter = new Emitter()
            let called = false

            emitter.on('123', () => {
                called = true
            })

            emitter.emit('123')

            expect(called).toBe(true)
        })

        it('large number of listeners', () => {
            const emitter = new Emitter()
            let count = 0

            for (let i = 0; i < 1000; i++) {
                emitter.on('test', () => {
                    count++
                })
            }

            emitter.emit('test')

            expect(count).toBe(1000)
        })

        it('large number of events', () => {
            const emitter = new Emitter()
            let count = 0

            for (let i = 0; i < 1000; i++) {
                emitter.on(`event-${i}`, () => {
                    count++
                })
            }

            for (let i = 0; i < 1000; i++) {
                emitter.emit(`event-${i}`)
            }

            expect(count).toBe(1000)
        })
    })

    describe('subclass support', () => {
        it('can be extended', () => {
            class MyEmitter extends Emitter {
                public emitCustom() {
                    return this.emit('custom')
                }
            }

            const emitter = new MyEmitter()
            let called = false

            emitter.on('custom', () => {
                called = true
            })

            emitter.emitCustom()

            expect(called).toBe(true)
        })

        it('subclass can access protected properties', () => {
            class InspectableEmitter extends Emitter {
                public getInternalSize() {
                    return this.eventListeners.size + this.onceListeners.size
                }
            }

            const emitter = new InspectableEmitter()

            emitter.on('a', () => {})
            emitter.once('b', () => {})

            expect(emitter.getInternalSize()).toBe(2)
        })
    })
})
