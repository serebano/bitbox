import { queue, state } from "./store"
import { is } from "../../utils"

/**
 * bitbox.observe
 * Observes observable target
 * @param  {Function}   observer
 * @param  {Array}      args
 * @return {Object}
 */

export default function observe(observer, ...args) {
    if (!is.func(observer))
        throw new TypeError(`[bitbox.observe] First argument must be a function`)

    const o = createObserver(observer, args)
    runObserver(o)

    return o
}

function createObserver(observer, args) {
    const o = {
        observer,
        args,
        keys: [],
        paths: [],
        changes: [],
        changed: 0,
        run(...args) {
            return o.keys ? runObserver(o, args, true) : o.observer(...args)
        },
        skip() {
            return queue.delete(o)
        },
        on() {
            o.keys = []
            o.paths = []
            runObserver(o)
            return o
        },
        off() {
            if (o.keys) {
                o.keys.forEach(observers => {
                    observers.delete(o)
                })
                delete o.keys
                queue.delete(o)
            }
        }
    }

    return o
}

export function runObserver(o, args, isRun) {
    let result
    try {
        state.currentObserver = o
        result = o.observer.apply(undefined, args ? o.args.concat(args) : o.args)
    } finally {
        state.currentObserver = undefined
        if (!isRun) o.changes = []
        if (!isRun) o.changed++
    }
    return result
}

export function runObservers() {
    queue.forEach(o => runObserver(o))
    queue.clear()
    state.queued = false
}
