import { is, toPrimitive, toJSON, toArray } from "../utils";
import bitbox, { symbol } from ".";

let keyPath, keyPrimitive;

function createBox(keys = [], isRoot = true) {
    const root = [...keys];

    function box(...args) {
        if (isRoot) Reflect.set(box, symbol.path, root.slice(0));

        const object = is.object(args[args.length - 1]) && args.pop();
        const keys = bitbox.path(box);
        keys.push(...args);

        try {
            if (object) return bitbox.resolve(object, keys);

            return createBox(keys);
        } catch (e) {
            throw e;
        }
    }

    Object.defineProperties(box, {
        [symbol.path]: {
            value: root,
            writable: true
        },
        [Symbol.iterator]: {
            value: function iterator() {
                let array = Reflect.get(box, symbol.path);
                let index = 0;
                return {
                    next() {
                        return index < array.length
                            ? { value: array[index++], done: false }
                            : { done: true };
                    }
                };
            }
        },
        [Symbol.toPrimitive]: {
            value: function primitive() {
                return (keyPrimitive = toPrimitive(Reflect.get(box, symbol.path)));
            }
        },
        [Symbol.toStringTag]: {
            value: function tag() {
                return "bitbox";
            }
        },
        [Symbol.isConcatSpreadable]: {
            value: false
        }
    });

    return createProxy(box, isRoot, root);
}

function createProxy(box, isRoot, root) {
    return new Proxy(box, {
        get(target, key, receiver) {
            if (isRoot) Reflect.set(target, symbol.path, root.slice(0));

            const keys = Reflect.get(target, symbol.path);
            const mapping = keys.length && keys[keys.length - 1];

            if (is.object(mapping) && Reflect.has(mapping, key)) {
                return Reflect.get(mapping, key);
            }

            if (key === "apply") return Reflect.get(target, key);
            if (key === "toJSON") return () => toJSON(keys);
            if (key === "toArray") return () => toArray(keys);
            if (key === "displayName") return toPrimitive(keys);

            if (key === Symbol.toPrimitive) {
                keyPath = keys;
                return Reflect.get(target, Symbol.toPrimitive);
            }

            if (typeof key === "symbol" && Reflect.has(target, key))
                return Reflect.get(target, key);

            if (keyPath !== undefined && keyPrimitive === key) {
                keys.push(keyPrimitive);
                keyPath = undefined;
                keyPrimitive = undefined;
            } else {
                keys.push(key);
            }

            return isRoot ? createBox(keys, false) : receiver;
        },
        set(target, key, value) {
            const keys = bitbox.path(target);
            const prev = keys.length && keys[keys.length - 1];
            const args = is.object(value) ? [value] : value;

            if (is.object(prev)) {
                Reflect.set(prev, key, createBox(args));
            } else {
                root.push({
                    [key]: createBox(args)
                });
            }

            if (isRoot) Reflect.set(target, symbol.path, root.slice(0));

            return true;
        }
    });
}

export default createBox;
