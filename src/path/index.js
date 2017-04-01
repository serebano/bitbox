import is from "../is";
import { wellKnownSymbols } from "../utils";

export const isPath = Symbol("Path.isPath");
export const toKeys = Symbol("Path.toKeys");
export const extend = Symbol("Path.extend");

export const toPrimitive = () => "";

let keyTransfer = null;

/**
 * Create path
 * @param  {Function}   resolve
 * @param  {Array}      [root=[]]
 * @param  {Boolean}    [isRoot=true]
 */

function Path(resolve, root = [], isRoot = true) {
    let path = root.slice();

    const proxy = new Proxy(resolve, {
        construct(target, [res]) {
            if (is.function(res))
                return Path(
                    function(path) {
                        return res.apply(this, [path, resolve.apply(this, arguments)]);
                    },
                    path.slice(),
                    true
                );
            return Path(resolve, path.slice(), true);
        },
        apply(target, context, args) {
            if (isRoot) path = root.slice();
            if (keyTransfer) path.push(keyTransfer);
            keyTransfer = undefined;

            return target.apply(proxy, [path].concat(args));
        },
        get(target, key, receiver) {
            if (key === extend) return Path(resolve, path.slice(), true);
            if (key === "toString") return () => toString(path.slice());

            if (key === isPath) return true;
            if (key === toKeys) return path;

            if (key === Symbol.toPrimitive) {
                keyTransfer = receiver;
                return toPrimitive;
            }

            if (typeof key === "symbol" && wellKnownSymbols.has(key))
                return Reflect.get(target, key, receiver);

            const step = keyTransfer || key;
            keyTransfer = undefined;

            if (isRoot) return Path(resolve, path.concat(step), false);

            path.push(step);

            return receiver;
        },
        has(target, key) {
            return true;
        }
    });

    return proxy;
}

Path.keys = arg => Path.isPath(arg) && arg[toKeys];
Path.isPath = arg => arg && arg[isPath];
Path.extend = path => path[extend];

function toString(path) {
    if (!path.length) return `$`;
    if (path.length === 1) return is.path(path[0]) ? `${path[0].toString()}` : String(path[0]);
    return `${path.map((p, i) => is.path(p) ? `[${p.toString()}]` : i > 0 ? `.${p}` : p).join("")}`;
}

export default Path;
