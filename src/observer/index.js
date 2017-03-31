import native from "./native";
import nextTick from "./nextTick";
import { wellKnownSymbols } from "../utils";

export const proxies = new WeakMap();
export const observers = new WeakMap();
export const queue = new Set();

const enumerate = Symbol("enumerate");

let queued = false;
let currentObserver;

/**
 * Observe
 * @param  {Function}   fn      Observer function
 * @param  {Array}      args    Arguments to be passed
 * @return {Object}             Observer object
 */

export function observe(fn, ...args) {
    if (typeof fn !== "function") throw new TypeError("First argument must be a function");
    args = args.length ? args : undefined;

    const observer = createObserver(fn, args);
    runObserver(observer);

    return observer;
}

function createObserver(fn, args) {
    return {
        fn,
        args,
        keys: [],
        paths: [],
        run() {
            runObserver(this);
        },
        unobserve() {
            if (this.fn) {
                const paths = this.paths;
                this.keys.forEach(observers => {
                    observers.delete(this);
                });
                this.fn = (this.paths = (this.args = (this.keys = undefined)));
                queue.delete(this);

                return paths;
            }
        },
        unqueue() {
            queue.delete(this);
        }
    };
}

function runObserver(observer) {
    try {
        currentObserver = observer;
        observer.fn.apply(observer, observer.args);
    } finally {
        currentObserver = undefined;
    }
}

function registerObserver(target, key, path) {
    if (currentObserver) {
        const targetObservers = observers.get(target);
        if (!targetObservers.has(key)) targetObservers.set(key, new Set());

        const keyObservers = targetObservers.get(key);

        if (!keyObservers.has(currentObserver)) {
            keyObservers.add(currentObserver);

            currentObserver.keys.push(keyObservers);
            currentObserver.paths.push(path.concat(key));
        }
    }
}

export function observable(obj) {
    obj = obj || {};

    if (typeof obj !== "object")
        throw new TypeError("first argument must be an object or undefined");

    return proxies.get(obj) || createObservable(obj);
}

function createProxy(obj, path = []) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            if (key === "$raw") return target;
            if (typeof key === "symbol" && wellKnownSymbols.has(key)) return result;

            const result = Reflect.get(target, key, receiver);
            const isObject = typeof result === "object" && result;
            const observable = isObject && proxies.get(result);

            if (currentObserver) {
                registerObserver(target, key, path);

                if (isObject) return observable || createObservable(result, path.concat(key));
            }

            return observable || result;
        },

        set(target, key, value, receiver) {
            if (key === "length" || value !== Reflect.get(target, key, receiver)) {
                queueObservers(target, key);
                queueObservers(target, enumerate);
            }
            if (typeof value === "object" && value) {
                value = value.$raw || value;
            }

            return Reflect.set(target, key, value, receiver);
        },

        deleteProperty(target, key) {
            if (Reflect.has(target, key)) {
                queueObservers(target, key);
                queueObservers(target, enumerate);
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
    const builtIn = native.get(obj.constructor);

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

export function isObservable(obj) {
    if (typeof obj !== "object") throw new TypeError("first argument must be an object");

    return proxies.get(obj) === obj;
}

function queueObservers(target, key) {
    const observersForKey = observers.get(target).get(key);
    if (observersForKey && observersForKey.constructor === Set) {
        observersForKey.forEach(queueObserver);
    } else if (observersForKey) {
        queueObserver(observersForKey);
    }
}

function queueObserver(observer) {
    if (!queued) {
        nextTick(runObservers);
        queued = true;
    }
    queue.add(observer);
}

function runObservers() {
    queue.forEach(runObserver);
    queue.clear();
    queued = false;
}
