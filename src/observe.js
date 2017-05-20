import is from "./is"
import { queue, state, observers } from "./observer/store"

/**
 * bitbox.observe
 * Observes observable target
 * @param  {Function}   observer
 * @param  {Array}      args
 * @return {Object}
 */

function observe(fn, ...args) {
    if (!is.func(fn)) throw new TypeError(`[observe] First argument must be a function`)

    return runObserver(create(fn, args))
}

observe.state = { queue, state, observers }

export default observe

function create(fn, args) {
    const observer = {
        keys: [],
        paths: [],
        changes: [],
        changed: 0,
        run() {
            const result = fn.apply(undefined, args)
            observer.changed++
            observer.changes = []
            return result
        },
        skip() {
            queue.delete(observer)
        },
        on() {
            observer.keys = []
            observer.paths = []
            runObserver(observer)
        },
        off() {
            observer.keys.forEach(observers => {
                observers.delete(observer)
            })
            observer.keys = []
            observer.paths = []
            queue.delete(observer)
        },
        reload() {
            observer.off()
            observer.on()
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
    return observer
}

export function runObservers() {
    queue.forEach(runObserver)
    queue.clear()
    state.queued = false
}
