import { is, toPrimitive } from "./utils";

let keyPath, keyPrimitive;

bitbox.keys = Symbol.for("bitbox.keys");
bitbox.root = Symbol.for("bitbox.root");
bitbox.mapping = Symbol.for("bitbox.mapping");

function bitbox(keys = [], isRoot = true) {
    const root = Array.from(keys);

    function box(...args) {
        if (isRoot) Reflect.set(box, bitbox.keys, Reflect.get(box, bitbox.root).slice(0));

        const object = is.object(args[args.length - 1]) && args.pop();
        Reflect.set(box, bitbox.keys, [...Reflect.get(box, bitbox.keys), ...args]);

        return object ? resolve(object, box) : bitbox(box);
    }

    Reflect.set(box, bitbox.root, root);
    Reflect.set(box, bitbox.keys, root);
    Reflect.set(box, Symbol.isConcatSpreadable, false);
    Reflect.set(
        box,
        Symbol.toPrimitive,
        () => keyPrimitive = toPrimitive(Reflect.get(box, bitbox.keys))
    );
    Reflect.set(box, Symbol.iterator, () =>
        Array.prototype[Symbol.iterator].call(Reflect.get(box, bitbox.keys)));

    return new Proxy(box, {
        get(target, key, receiver) {
            if (isRoot) Reflect.set(target, bitbox.keys, Reflect.get(target, bitbox.root).slice(0));
            if (key === "apply") return Reflect.get(target, key);
            if (key === "displayName") return toPrimitive(Reflect.get(target, bitbox.keys));
            if (key === Symbol.toPrimitive) {
                keyPath = Reflect.get(target, bitbox.keys);
                return Reflect.get(target, Symbol.toPrimitive);
            }
            if (typeof key === "symbol" && Reflect.has(target, key))
                return Reflect.get(target, key);

            Reflect.set(target, bitbox.keys, [
                ...Reflect.get(target, bitbox.keys),
                keyPath !== undefined && keyPrimitive === key ? keyPath : key
            ]);

            keyPath = undefined;
            keyPrimitive = undefined;

            return isRoot ? bitbox(target, false) : receiver;
        },
        set(target, key, value) {
            const mapping = Reflect.get(target, bitbox.mapping);
            return Reflect.set(mapping, key, value);
        },
        deleteProperty(target, key) {
            const mapping = Reflect.get(target, bitbox.mapping);
            return Reflect.deleteProperty(mapping, key);
        }
    });
}

function resolve(object, path = []) {
    const keys = Array.from(path);

    if (is.trap(keys[0])) {
        path[bitbox.root] = [];
        const [trap, ...args] = path[bitbox.keys].splice(0);
        if (trap.name === "resolve") return trap(resolve, object, args);
        if (trap.name === "get") return trap(object);
        throw new Error(`${trap.name} is not valid for root`);
    }

    return keys.reduce(
        (target, key, index, keys) => {
            if (is.box(key)) key = resolve(object, key);
            if (is.array(key)) key = resolve(object, key);

            if (is.trap(keys[index + 1])) {
                const [fn, ...args] = keys.splice(index + 1);
                if (fn.name === "resolve") return fn(resolve, target[key], args);
                if (fn.name === "set") return fn(target, key, args[0], object);
                return fn(target, key, object);
            }

            if (is.function(key)) {
                return key(
                    is.object(target)
                        ? new Proxy(target, {
                              set(target, key, value) {
                                  return Reflect.set(
                                      target,
                                      key,
                                      is.box(value) ? value(object) : value
                                  );
                              }
                          })
                        : target
                );
            }

            return target && target[key];
        },
        object
    );
}

function apply(resolve, object, keys) {
    return resolve(object, keys);
}

function get(target, key, obj) {
    return Reflect.get(target, key);
}

function set(target, key, value, obj) {
    return Reflect.set(target, key, value);
}

function has(target, key, obj) {
    return Reflect.has(target, key);
}

function deleteProperty(target, key, obj) {
    return Reflect.deleteProperty(target, key);
}

function map(target, map, object) {
    const mapKeys = Object.keys(map);
    if (mapKeys.length) {
        return mapKeys.reduce(
            (obj, key) => {
                obj[key] = is.box(map[key]) || is.compute(map[key]) ? map[key](object) : map[key];
                return obj;
            },
            target
        );
    }
}

export default Object.assign(bitbox, { map, get, set, has, resolve, apply, deleteProperty });
