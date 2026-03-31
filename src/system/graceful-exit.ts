export type ExitHandler = (exitCode?: number) => Promise<void>

const exitTasks = new Map<ExitHandler, number>()

export function addExitHandler(handler: ExitHandler, maxWaitTime = 3000) {
    exitTasks.set(handler, maxWaitTime)

    return () => {
        exitTasks.delete(handler)
    }
}

let _isExiting = false
let _exitPromise: Promise<never> | undefined

export const isExiting = () => {
    return _isExiting
}

export function gracefulExit(exitCode = 0, maxWaitTime = 3000): Promise<never> {
    if (_exitPromise) {
        return _exitPromise
    }

    _isExiting = true

    if (exitTasks.size === 0) {
        process.exit(exitCode)
    }

    const promises: Array<Promise<void>> = []

    for (const [handler, wait] of exitTasks) {
        promises.push(Promise.resolve().then(() => handler(exitCode)))
        maxWaitTime = Math.max(maxWaitTime, wait)
    }

    const timer = setTimeout(() => process.exit(exitCode), maxWaitTime)

    function finish(): never {
        clearTimeout(timer)
        process.exit(exitCode)
    }

    return _exitPromise = Promise.allSettled(promises).then(finish)
}
