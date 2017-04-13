import { is, toPrimitive } from "./utils";
import { resolve } from "./handler";

let keyPath, keyPrimitive;
export const symbol = {};

symbol.keys = Symbol("bitbox.keys");
symbol.root = Symbol("bitbox.root");
symbol.mapping = Symbol("bitbox.mapping");

/**
 * bitbox
 * @param  {Array}
 * @return {Function}
 */

export default function bitbox() {
    return createBox(arguments);
}

/**
 * Create box from array
 * @return {Function}
 */

bitbox.from = function from() {
    return createBox(Array.from(...arguments));
};

function createBox(keys = [], isRoot = true) {
    function box(...args) {
        if (isRoot) Reflect.set(box, symbol.keys, Reflect.get(box, symbol.root));

        const object = is.object(args[args.length - 1]) && args.pop();
        Reflect.set(box, symbol.keys, Reflect.get(box, symbol.keys).concat(args));

        return object ? resolve(object, box) : createBox(box);
    }

    const root = !is.array(keys) ? Array.from(keys) : keys;

    Reflect.set(box, symbol.root, root);
    Reflect.set(box, symbol.keys, root);
    Reflect.set(box, Symbol.toStringTag, () => `bitbox`);
    Reflect.set(box, Symbol.isConcatSpreadable, false);
    Reflect.set(
        box,
        Symbol.toPrimitive,
        () => keyPrimitive = toPrimitive(Reflect.get(box, symbol.keys))
    );
    Reflect.set(box, Symbol.iterator, () =>
        Array.prototype[Symbol.iterator].call(Reflect.get(box, symbol.keys)));

    return createProxy(box, isRoot);
}

bitbox.proxy = mappingProxy;

function mappingProxy(target, object) {
    return new Proxy(target, {
        get(target, key) {
            if (Reflect.has(target, key)) {
                const box = Reflect.get(target, key);
                if (!object) return is.box(box) ? box : createBox(box);
                return resolve(object, box);
            }
        },
        set(target, key, value) {
            if (Reflect.has(target, key)) {
                const box = Reflect.get(target, key);
                if (!object)
                    return is.box(box)
                        ? box
                        : createBox(box)(bitbox.set, is.box(value) ? value(object) : value);

                return resolve(object, [...box, bitbox.set, is.box(value) ? value(object) : value]);
            }
            return false;
        }
    });
}

function createProxy(box, isRoot, mapping = {}) {
    const proxy = new Proxy(box, {
        apply(target, thisArg, args) {
            const keys = Reflect.get(target, symbol.keys);
            const last = keys[keys.length - 1];

            if (is.object(last) && !is.array(last)) {
                mapping = last;
            }

            if (Object.keys(mapping).length) {
                const object = is.object(args[args.length - 1]) && args.pop();

                if (object) return resolve(mappingProxy(mapping, object), args);
            }

            return Reflect.apply(target, thisArg, args);
        },
        get(target, key, receiver) {
            if (isRoot) Reflect.set(target, symbol.keys, Reflect.get(target, symbol.root).slice(0));

            const keys = Reflect.get(target, symbol.keys);
            const last = keys[keys.length - 1];

            if (is.object(last) && !is.array(last)) {
                const path = Reflect.get(last, key);
                return is.box(path) ? path : bitbox.from(path);
            }

            if (Reflect.has(mapping, key)) {
                return Reflect.get(mapping, key);
            }

            if (key === "apply") return Reflect.get(target, key);
            if (key === "displayName") return toPrimitive(Reflect.get(target, symbol.keys));

            if (key === Symbol.toPrimitive) {
                keyPath = Reflect.get(target, symbol.keys);
                return Reflect.get(target, Symbol.toPrimitive);
            }

            if (typeof key === "symbol" && Reflect.has(target, key))
                return Reflect.get(target, key);

            Reflect.set(target, symbol.keys, [
                ...Reflect.get(target, symbol.keys),
                keyPath !== undefined && keyPrimitive === key ? keyPath : key
            ]);

            keyPath = undefined;
            keyPrimitive = undefined;

            return isRoot ? createBox(target, false) : receiver;
        },
        set(target, key, value) {
            return Reflect.set(mapping, key, bitbox.from(value));
        },
        deleteProperty(target, key) {
            return Reflect.deleteProperty(mapping, key);
        }
    });
    return proxy;
}
