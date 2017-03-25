export const proxies = new WeakMap();
export const observers = new WeakMap();

export const changes = (Observe.changes = []);

Observe.proxies = proxies;
Observe.observers = observers;
Observe.isObservable = isObservable;

Observe.has = has;
Observe.get = get;
Observe.add = add;
Observe.map = map;
Observe.on = on;

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

    const observable = proxies.has(object)
        ? proxies.get(object)
        : createProxy(object, [], onChange);

    if (!observers.has(observable.object)) observers.set(observable.object, new Set());
    if (observer) observers.get(observable.object).add(observer);

    return observable.object;
}

function on(type, fn) {
    if (arguments.length === 1) return on("*", type);
    const off = () => on.listeners.splice(on.listeners.indexOf(listener), 1);
    const listener = { type, fn, off };
    on.listeners = (on.listeners || []).concat(listener);

    return listener;
}

function onChange(change) {
    Observe.changes.push(change);

    if (on.listeners && on.listeners.length)
        on.listeners
            .filter(i => i.type === "*" || i.type === change.type)
            .forEach(i => i.fn(change, changes));

    if (observers.has(change.object)) {
        const objectChanges = changes.filter(c => c.object === change.object);

        observers.get(change.object).forEach(observer => {
            observer(changes, change);
        });
    }
}

function createProxy(object, path, onChange) {
    let observing = true;

    const proxyObject = new Proxy(object, {
        get(target, key, receiver) {
            if (key === "$") return get(target);
            if (key === "$raw") return target;
            if (key === "$path") return path;
            if (key === "$observers") return observers.get(receiver);

            const result = Reflect.get(target, key, receiver);
            const isObject = typeof result === "object" && result;
            const observable = isObject && proxies.has(result) && proxies.get(result).object;

            if (isObject)
                return observable || createProxy(result, path.concat(key), onChange).object;

            return observable || result;
        },

        set(object, property, value) {
            const hadProperty = Reflect.has(object, property);
            const oldValue = hadProperty && Reflect.get(object, property);
            const returnValue = Reflect.set(object, property, value);

            if (observing && Reflect.get(object, property) !== oldValue) {
                if (hadProperty) {
                    onChange({
                        object: proxyObject,
                        type: "update",
                        path: path.concat(property),
                        name: property,
                        oldValue: oldValue
                    });
                } else {
                    onChange({
                        object: proxyObject,
                        type: "add",
                        path: path.concat(property),
                        name: property
                    });
                }
            }

            return returnValue;
        },

        deleteProperty(object, property) {
            const hadProperty = Reflect.has(object, property);
            const oldValue = hadProperty && Reflect.get(object, property);
            const returnValue = Reflect.deleteProperty(object, property);

            if (observing && hadProperty) {
                onChange({
                    object: proxyObject,
                    type: "delete",
                    path: path.concat(property),
                    name: property,
                    oldValue: oldValue
                });
            }

            return returnValue;
        },

        defineProperty(object, property, descriptor) {
            const hadProperty = Reflect.has(object, property);
            const oldValue = hadProperty && Reflect.getOwnPropertyDescriptor(object, property);
            const returnValue = Reflect.defineProperty(object, property, descriptor);

            if (observing && hadProperty) {
                onChange({
                    object: proxyObject,
                    type: "reconfigure",
                    path: path.concat(property),
                    name: property,
                    oldValue: oldValue
                });
            } else if (observing) {
                onChange({
                    object: proxyObject,
                    type: "add",
                    path: path.concat(property),
                    name: property
                });
            }
            return returnValue;
        },

        preventExtensions(object) {
            const returnValue = Reflect.preventExtensions(object);
            if (observing) {
                onChange({
                    object: proxyObject,
                    type: "preventExtensions",
                    path
                });
            }
            return returnValue;
        }
    });

    const obs = { path, object: proxyObject };

    proxies.set(object, obs);
    proxies.set(proxyObject, obs);

    return obs;
}

function isObservable(object) {
    if (typeof object !== "object") throw new TypeError("first argument must be an object");
    return proxies.has(object) && proxies.get(object).object === object;
}

export default Observe;
