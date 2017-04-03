import is from "../utils/is";
import { pathToString } from "../utils";
import { wellKnownSymbols } from "../utils";

let keyPath = null;

export const symbol = Symbol("bitbox.path");

export function isPath(path) {
    return is.function(path) && Reflect.has(path, symbol);
}

export function resolve(path, ...args) {
    return is.path(path) || is.compute(path) ? path(...args) : path;
}

export function reduce(path, target) {
    return is.function(target)
        ? Path(path.concat(Array.prototype.slice.call(arguments, 1)))
        : path.reduce((obj, key) => is.function(key) ? key(obj) : obj[key], target);
}

export function extend(path, construct) {
    return is.function(construct)
        ? Path(construct(path.$reducer), path.$path)
        : Path(path.$reducer, path.$path);
}

/**
 * Create path
 * @param  {Function}   reducer
 * @param  {Array}      [root=[]]
 * @param  {Boolean}    [isRoot=true]
 */

function Path(reducer, root = [], isRoot = true) {
    if (is.array(reducer)) return Path(reduce, reducer);
    if (is.string(reducer)) return Path(reduce, reducer.split("."));
    if (is.path(reducer)) return extend(reducer, root);

    let path = keyPath ? root.concat(keyPath) : root.slice();
    keyPath = undefined;

    return new Proxy(reducer, {
        construct(target, args) {
            const [construct] = args;
            if (isRoot) path = root.slice();
            keyPath = undefined;

            return is.function(construct) ? Path(construct(target), path) : Path(target, path);
        },
        apply(target, context, args) {
            if (isRoot) path = root.slice();
            keyPath = undefined;

            return target.apply(context, [path].concat(args));
        },
        get(target, key, receiver) {
            if (key === symbol) return true;
            if (isRoot) path = root.slice();
            if (key === "$path") {
                keyPath = undefined;
                return path;
            }
            if (key === "$root") return root;
            if (key === "$reducer") return target;
            if (key === Symbol.toPrimitive) {
                keyPath = receiver;
                return () => pathToString(path.slice());
            }
            if (key !== "name" && Reflect.has(target, key, receiver))
                return Reflect.get(target, key, receiver);
            if (typeof key === "symbol" && wellKnownSymbols.has(key))
                return Reflect.get(target, key, receiver);

            const step = keyPath || key;
            keyPath = undefined;

            if (isRoot) return Path(target, path.concat(step), false);

            path.push(step);

            return receiver;
        },
        has(target, key) {
            return true;
        }
    });
}

export default Path;
