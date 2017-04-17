import { wellKnownSymbols, nextTick } from "../utils";
import wrappers from "./wrappers";

const queue = new Set();
const proxies = new WeakMap();
const observers = new WeakMap();
const enumerate = Symbol("enumerate");

observe.index = new Map();

let queued = false;
let currentObserver;

/**
 * bitbox.observable
 * Creates observable target
 * @param  {Object} object
 * @return {Object}
 */

export function observable(object) {
    object = object || {};

    if (typeof object !== "object")
        throw new TypeError(`[bitbox.observable] first argument must be an object or undefined`);

    return proxies.get(object) || createObservable(object);
}

/**
 * bitbox.observe
 * Observes observable target
 * @param  {Function}   fn
 * @param  {Array}      args
 * @return {Object}
 */

export function observe(observer, ...args) {
    if (typeof observer !== "function") {
        throw new TypeError(`[bitbox.observe] First argument must be a function`);
    }

    const o = createObserver(observer, args);
    runObserver(o);

    return o;
}

function createObserver(observer, args) {
    const o = {
        observer,
        args,
        keys: [],
        paths: [],
        changes: [],
        changed: 0,
        name: observer.displayName || observer.name,
        run(...args) {
            return runObserver(this, args);
        },
        skip() {
            return queue.delete(this);
        },
        unobserve() {
            if (this.observer) {
                observe.index.delete(this.observer);
                this.keys.forEach(observers => {
                    observers.delete(this);
                });
                this.observer = this.paths = this.args = this.keys = undefined;
                queue.delete(this);
            }
        }
    };

    observe.index.set(observer, o);

    return o;
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
    if (!queued) {
        nextTick(runObservers);
        queued = true;
    }
    queue.add(observer);
}

function runObserver(o, args) {
    let result;
    try {
        currentObserver = o;
        result = o.observer.apply(undefined, args ? o.args.concat(args) : o.args);
    } finally {
        currentObserver = undefined;
        if (!args) {
            o.changed++;
            o.changes = [];
        }
    }

    return result;
}

function runObservers() {
    queue.forEach(o => runObserver(o));
    queue.clear();
    queued = false;
}

function registerObserver(target, key, path) {
    if (currentObserver) {
        const targetObservers = observers.get(target);
        if (!targetObservers.has(key)) targetObservers.set(key, new Set());
        const keyObservers = targetObservers.get(key);
        if (!keyObservers.has(currentObserver)) {
            keyObservers.add(currentObserver);
            currentObserver.keys.push(keyObservers);
            //currentObserver.paths.push(path.concat(String(key)));
        }
    }
}

function createProxy(obj, path = []) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            if (key === "$") return target;
            const result = Reflect.get(target, key, receiver);
            if (typeof key === "symbol" && wellKnownSymbols.has(key)) return result;

            const isObject = typeof result === "object" && result;
            const observable = isObject && proxies.get(result);

            if (currentObserver) {
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

function createObservable(obj, path = []) {
    let observable;
    const builtIn = wrappers.get(obj.constructor);

    if (typeof builtIn === "function") {
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

export function isObservable(object) {
    if (typeof object !== "object") {
        throw new TypeError(`[bitbox.observable] first argument must be an object`);
    }

    return proxies.get(object) === object;
}
