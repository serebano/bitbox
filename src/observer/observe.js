import { queue, state } from "./store"
import { is } from "../../utils"

/**
 * bitbox.observe
 * Observes observable target
 * @param  {Function}   observer
 * @param  {Array}      args
 * @return {Object}
 */

export default function observe(fn, context, ...args) {
    if (!is.func(fn)) throw new TypeError(`[observe] Target argument must be a function`)

    const observer = create(fn, context, args)
    runObserver(observer)

    return observer
}

function create(fn, context, args) {
    const observer = {
        keys: [],
        paths: [],
        changes: [],
        changed: 0,
        run() {
            const result = fn.apply(context, args)

            observer.changed++
            observer.changes = []

            return result
        },
        exec(fn, ...args) {
            observer.off()
            observer.keys = []
            observer.paths = []
            observer.changed = 0
            observer.changes = []
            const run = observer.run
            observer.run = () => fn.apply(undefined, args)
            runObserver(observer)
            observer.run = run

            return {
                paths: observer.paths.map(p => p.join(".")),
                changes: observer.changes.map(p => p.join("."))
            }
        },
        skip() {
            return queue.delete(observer)
        },
        on() {
            observer.keys = []
            observer.paths = []
            runObserver(observer)

            return observer
        },
        off() {
            if (observer.keys) {
                observer.keys.forEach(observers => {
                    observers.delete(observer)
                })
                delete observer.keys
                queue.delete(observer)
            }

            return observer
        },
        reload() {
            observer.off()
            return observer.on()
        }
    }

    return observer
}

export function runObserver(observer) {
    try {
        state.currentObserver = observer
        observer.run()
    } finally {
        state.currentObserver = undefined
    }
}

export function runObservers() {
    queue.forEach(runObserver)
    queue.clear()
    state.queued = false
}
