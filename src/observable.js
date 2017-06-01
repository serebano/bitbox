import is from "./is"
import wrappers from "./observer/wrappers"
import { proxies, observers, queue, state, enumerate } from "./observer/store"
import { wellKnownSymbols, nextTick } from "./utils"
import observe, { runObservers } from "./observe"

/**
 * observable()
 *
 * Creates observable target
 * @param  {Object} object
 * @return {Object}
 */

function observable(target) {
    //if (arguments.length >= 2) return observable.key(...arguments)
    //if (is.string(target) || is.number(target)) return observable.value(target)

    target = target || {}

    if (!is.complexObject(target))
        throw new TypeError(`[observable] target must be an object or undefined`)

    return proxies.get(target) || create(target)
}

observable.proxies = proxies

export default observable

observable.key = function observableKey(target, key, value) {
    const object = observable({ [key]: value })

    return Object.defineProperty(target, key, {
        enumerable: true,
        get: () => Reflect.get(object, key),
        set: value => Reflect.set(object, key, value)
    })
}

observable.value = function observableValue(value) {
    return observable({
        value,
        observe(fn) {
            return observe(() => fn(Reflect.get(this, "value")))
        },
        toString() {
            return String(this.value)
        }
    })
}

observable.box = function observableBox(value) {
    const object = observable({ value })

    return {
        get: () => Reflect.get(object, "value"),
        set: value =>
            is.func(value)
                ? Reflect.set(object, "value", value(Reflect.get(object, "value")))
                : Reflect.set(object, "value", value),
        observe: fn => observe(() => fn(Reflect.get(object, "value")))
    }
}

function create(target, path = []) {
    let observable

    if (wrappers.has(target.constructor)) {
        observable = wrappers.get(target.constructor)(
            target,
            path,
            registerObserver,
            queueObservers
        )
    } else {
        observable = createProxy(target, path)
    }

    proxies.set(target, observable)
    proxies.set(observable, observable)

    observers.set(target, new Map())

    return observable
}

function createProxy(obj, path = []) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            if (key === "$") return target
            if (key === "$observers") {
                return observers.get(target)
                return {
                    target,
                    path,
                    get observers() {
                        return observers.get(target)
                        const res = {}
                        for (const [key, o] of observers.get(target).entries()) {
                            res[key] = [...o].map(o => {
                                return {
                                    name: o.name,
                                    paths: o.paths.map(p => p.join(".")),
                                    changes: o.changes.map(p => p.join(".")),
                                    runs: o.changed
                                }
                            })
                        }
                        return res
                    }
                }
            }

            const result = Reflect.get(target, key, receiver)
            if (is.symbol(key) && wellKnownSymbols.has(key)) return result
            const isObject = is.complexObject(result) && result
            const observable = isObject && proxies.get(result)

            if (state.currentObserver) {
                registerObserver(target, key, path)
                if (isObject) return observable || create(result, path.concat(key))
            }

            return observable || result
        },

        set(target, key, value, receiver) {
            if (key === "length" || value !== Reflect.get(target, key, receiver)) {
                queueObservers(target, key, path)
                queueObservers(target, enumerate, path)
            }

            if (typeof value === "object" && value) value = value.$ || value

            return Reflect.set(target, key, value, receiver)
        },

        deleteProperty(target, key) {
            if (Reflect.has(target, key)) {
                queueObservers(target, key, path)
                queueObservers(target, enumerate, path)
            }

            return Reflect.deleteProperty(target, key)
        },

        ownKeys(target) {
            registerObserver(target, enumerate, path)

            return Reflect.ownKeys(target)
        }
    })
}

function registerObserver(target, key, path) {
    if (state.currentObserver) {
        const targetObservers = observers.get(target)

        if (!targetObservers.has(key)) targetObservers.set(key, new Set())

        const keyObservers = targetObservers.get(key)

        if (!keyObservers.has(state.currentObserver)) {
            keyObservers.add(state.currentObserver)
            state.currentObserver.map.push([String(key), target])
            state.currentObserver.target = { target, key }
            state.currentObserver.keys.push(keyObservers)
            state.currentObserver.paths.push(path.concat(String(key)))
        }
    }
}

function queueObservers(target, key, path = []) {
    const observersForKey = observers.get(target).get(key)

    if (observersForKey && observersForKey.constructor === Set) {
        observersForKey.forEach(observer => {
            observer.changes.push(path.concat(String(key)))
            queueObserver(observer, path)
        })
    } else if (observersForKey) {
        observersForKey.changes.push(path.concat(String(key)))
        queueObserver(observersForKey, path)
    }
}

function queueObserver(observer) {
    if (!state.queued) {
        nextTick(runObservers)
        state.queued = true
    }
    queue.add(observer)
}
