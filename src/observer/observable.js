import wrappers from "./wrappers";
import { wellKnownSymbols, nextTick } from "../utils";
import { proxies, observers, queue, state, enumerate } from "./store";
import { runObservers } from "./observe";
import { is } from "../utils";

/**
 * bitbox.observable
 * Creates observable target
 * @param  {Object} object
 * @return {Object}
 */

export default function observable(object) {
    object = object || {};

    if (!is.complexObject(object))
        throw new TypeError(`[bitbox.observable] first argument must be an object or undefined`);

    return proxies.get(object) || createObservable(object);
}

function createObservable(obj, path = []) {
    let observable;
    const builtIn = wrappers.get(obj.constructor);

    if (is.function(builtIn)) {
        observable = builtIn(obj, path, registerObserver, queueObservers);
    } else if (!builtIn) {
        observable = createProxy(obj, path);
    } else {
        observable = obj;
    }

    proxies.set(obj, observable);
    proxies.set(observable, observable);

    observers.set(obj, new Map());

    return observable;
}

function createProxy(obj, path = []) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            if (key === "$") return target;
            const result = Reflect.get(target, key, receiver);
            if (is.symbol(key) && wellKnownSymbols.has(key)) return result;

            const isObject = is.complexObject(result) && result;
            const observable = isObject && proxies.get(result);

            if (state.currentObserver) {
                registerObserver(target, key, path);
                if (isObject) {
                    return observable || createObservable(result, path.concat(key));
                }
            }

            return observable || result;
        },

        set(target, key, value, receiver) {
            if (key === "length" || value !== Reflect.get(target, key, receiver)) {
                queueObservers(target, key, path);
                queueObservers(target, enumerate, path);
            }
            if (typeof value === "object" && value) {
                value = value.$ || value;
            }

            return Reflect.set(target, key, value, receiver);
        },

        deleteProperty(target, key) {
            if (Reflect.has(target, key)) {
                queueObservers(target, key, path);
                queueObservers(target, enumerate, path);
            }
            return Reflect.deleteProperty(target, key);
        },

        ownKeys(target) {
            registerObserver(target, enumerate, path);
            return Reflect.ownKeys(target);
        }
    });
}

function registerObserver(target, key, path) {
    if (state.currentObserver) {
        const targetObservers = observers.get(target);
        if (!targetObservers.has(key)) targetObservers.set(key, new Set());
        const keyObservers = targetObservers.get(key);
        if (!keyObservers.has(state.currentObserver)) {
            keyObservers.add(state.currentObserver);
            state.currentObserver.keys.push(keyObservers);
            //state.currentObserver.paths.push(path.concat(String(key)));
        }
    }
}

function queueObservers(target, key, path = []) {
    const observersForKey = observers.get(target).get(key);

    if (observersForKey && observersForKey.constructor === Set) {
        observersForKey.forEach(observer => {
            observer.changes.push(path.concat(String(key)));
            queueObserver(observer, path);
        });
    } else if (observersForKey) {
        observersForKey.changes.push(path.concat(String(key)));
        queueObserver(observersForKey, path);
    }
}

function queueObserver(observer) {
    if (!state.queued) {
        nextTick(runObservers);
        state.queued = true;
    }
    queue.add(observer);
}
