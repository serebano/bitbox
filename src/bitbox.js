import { is, toPrimitive } from "./utils";
import { resolve } from "./handler";

let keyPath, keyPrimitive;
export const symbol = {};

symbol.keys = Symbol("bitbox.keys");
symbol.root = Symbol("bitbox.root");
symbol.mapping = Symbol("bitbox.mapping");

/**
 * bitbox
 * @param  {Array}   [keys=[]]
 * @param  {Boolean} [isRoot=true]
 * @return {Function}
 */

function bitbox(keys = [], isRoot = true) {
    const root = Array.from(keys);

    function box(...args) {
        if (isRoot) Reflect.set(box, symbol.keys, Reflect.get(box, symbol.root));

        const object = is.object(args[args.length - 1]) && args.pop();
        Reflect.set(box, symbol.keys, Reflect.get(box, symbol.keys).concat(args));

        return object ? resolve(object, box) : bitbox(box);
    }

    Reflect.set(box, symbol.root, root);
    Reflect.set(box, symbol.keys, root);
    Reflect.set(box, symbol.mapping, {});
    Reflect.set(box, Symbol.toStringTag, () => `bitbox`);
    Reflect.set(box, Symbol.isConcatSpreadable, false);
    Reflect.set(
        box,
        Symbol.toPrimitive,
        () => keyPrimitive = toPrimitive(Reflect.get(box, symbol.keys))
    );
    Reflect.set(box, Symbol.iterator, () =>
        Array.prototype[Symbol.iterator].call(Reflect.get(box, symbol.keys)));

    return new Proxy(box, {
        get(target, key, receiver) {
            if (isRoot) Reflect.set(target, symbol.keys, Reflect.get(target, symbol.root).slice(0));
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

            return isRoot ? bitbox(target, false) : receiver;
        },
        set(target, key, value) {
            return Reflect.set(Reflect.get(target, symbol.mapping), key, value);
        },
        deleteProperty(target, key) {
            return Reflect.deleteProperty(Reflect.get(target, symbol.mapping), key);
        }
    });
}

export default bitbox;
