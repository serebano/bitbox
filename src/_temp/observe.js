export const proxies = new WeakMap();
export const observers = new WeakMap();

export const changes = (Observe.changes = []);
export const queuedObservers = new Set();

Observe.proxies = proxies;
Observe.observers = observers;
Observe.isObservable = isObservable;
Observe.listeners = {};
Observe.queuedObservers = queuedObservers;

Observe.has = has;
Observe.get = get;
Observe.add = add;
Observe.map = map;
Observe.run = run;
Observe.observe = observe;
Observe.on = on;

let currentObserver;

function get(object) {
    const observable = proxies.get(object);

    if (!observable) throw new Error(`Object not observable`);
    if (!observers.has(observable.object)) observers.set(observable.object, new Set());

    return {
        path: observable.path,
        object: observable.object,
        observers: observers.get(observable.object)
    };
}

function has(object) {
    return proxies.has(object);
}

function add(object, observer) {
    const obs = get(object);
    obs.observers.add(observer);

    return obs.object;
}

function map(...args) {
    return Observe(args, args.pop());
}

function Observe(object, observer) {
    object = object || {};
    if (typeof object !== "object")
        throw new TypeError("first argument must be an object or undefined");

    return proxies.has(object) ? proxies.get(object).object : createProxy(object, observer).object;
}

function on(type, fn) {
    if (arguments.length === 1) return on("*", type);
    const off = () => on.listeners.splice(on.listeners.indexOf(listener), 1);
    const listener = { type, fn, off };
    on.listeners = (on.listeners || []).concat(listener);

    return listener;
}

Observe.q = () => {
    Observe.queuedObservers.forEach(run);
    Observe.queuedObservers.clear();
};

function queueObservers(target, key, path) {
    if (!observers.has(target)) observers.set(target, new Map());

    const O = observers.get(target);
    const observersForKey = O.get(key);
    if (observersForKey) observersForKey.forEach(queueObserver);
    if (O.has("*")) O.get("*").forEach(queueObserver);
}

function queueObserver(observer) {
    Observe.queuedObservers.add(observer);
}
let asyncTimeout;
function onChange(change, target) {
    Observe.changes.push(change);
    queueObservers(target, change.key, change.path);
    console.log(`change size`, Observe.queuedObservers.size, change);

    clearTimeout(asyncTimeout);
    asyncTimeout = setTimeout(() => Observe.q());

    // if (on.listeners && on.listeners.length)
    //     on.listeners
    //         .filter(i => i.type === "*" || i.type === change.type)
    //         .forEach(i => i.fn(change, Observe.changes));
    //
    // if (observers.has(change.object)) {
    //     const objectChanges = changes.filter(c => c.object === change.object);
    //
    //     observers.get(change.object).forEach(observer => {
    //         observer(change, Observe.changes);
    //     });
    // }
}

function observe(fn, ...args) {
    const o = { fn, paths: [], args, keys: [] };
    run(o);
    return o;
}

function run(observer) {
    const currentPaths = observer.paths;
    observer.paths = [];
    currentObserver = observer;
    observer.fn(...observer.args);
    currentObserver = undefined;

    return observer;
}

function addObserver(target, key, path) {
    if (currentObserver) {
        const O = observers.get(target);
        let obs = O.get(key);
        if (!obs) {
            obs = new Set([currentObserver]);
            O.set(key, obs);
        } else
            obs.add(currentObserver);

        if (!path.length) {
            currentObserver.paths.push([key]);
        } else {
            currentObserver.paths[currentObserver.paths.length - 1].push(key);
        }
    }
}

function createProxy(object, observer, path = []) {
    let observing = true;

    const proxyObject = new Proxy(object, {
        get(target, key) {
            if (key === "$") return get(target);
            const result = Reflect.get(target, key);
            const isObject = typeof result === "object" && result;
            const observable = isObject && proxies.has(result) && proxies.get(result).object;

            if (currentObserver) {
                addObserver(target, key, path);
                if (isObject)
                    return observable || createProxy(result, observer, path.concat(key)).object;
            }

            return observable || result;
        },

        set(object, property, value) {
            const hadProperty = Reflect.has(object, property);
            const oldValue = hadProperty && Reflect.get(object, property);
            const ret = Reflect.set(object, property, value);

            if (Reflect.get(object, property) !== oldValue) {
                if (hadProperty) {
                    onChange(
                        {
                            object: proxyObject,
                            type: "update",
                            path: path.concat(property),
                            key: property,
                            oldValue: oldValue
                        },
                        object
                    );
                } else {
                    onChange(
                        {
                            object: proxyObject,
                            type: "add",
                            key: path.concat(property),
                            name: property
                        },
                        object
                    );
                }
            }
            return ret;
        },

        deleteProperty(object, property) {
            const hadProperty = Reflect.has(object, property);
            const oldValue = hadProperty && Reflect.get(object, property);
            const returnValue = Reflect.deleteProperty(object, property);

            if (observing && hadProperty) {
                onChange(
                    {
                        object: proxyObject,
                        type: "delete",
                        path: path.concat(property),
                        key: property,
                        oldValue: oldValue
                    },
                    object
                );
            }

            return returnValue;
        },

        defineProperty(object, property, descriptor) {
            const hadProperty = Reflect.has(object, property);
            const oldValue = hadProperty && Reflect.getOwnPropertyDescriptor(object, property);
            const returnValue = Reflect.defineProperty(object, property, descriptor);

            if (observing && hadProperty) {
                onChange(
                    {
                        object: proxyObject,
                        type: "reconfigure",
                        path: path.concat(property),
                        key: property,
                        oldValue: oldValue
                    },
                    object
                );
            } else if (observing) {
                onChange(
                    {
                        object: proxyObject,
                        type: "add",
                        path: path.concat(property),
                        key: property
                    },
                    object
                );
            }
            return returnValue;
        },

        preventExtensions(object) {
            const returnValue = Reflect.preventExtensions(object);
            if (observing) {
                onChange(
                    {
                        object: proxyObject,
                        type: "preventExtensions",
                        path
                    },
                    object
                );
            }
            return returnValue;
        }
    });

    const observable = { path, object: proxyObject };

    proxies.set(object, observable);
    proxies.set(proxyObject, observable);
    observers.set(object, new Map());

    return observable;
}

function isObservable(object) {
    if (typeof object !== "object") throw new TypeError("first argument must be an object");
    return proxies.has(object) && proxies.get(object).object === object;
}

export default Observe;
