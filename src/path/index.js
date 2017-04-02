import is from "../utils/is";
import { pathToString } from "../utils";
import { wellKnownSymbols } from "../utils";

const isPath = Symbol("Path.isPath");

let toPrimitive = () => "";
let keyPath = null;

/**
 * Create path
 * @param  {Function}   resolve
 * @param  {Array}      [root=[]]
 * @param  {Boolean}    [isRoot=true]
 */

function Path(resolve, root = [], isRoot = true) {
    if (is.path(resolve)) return Path.extend(resolve, root);

    let path = keyPath ? root.concat(keyPath) : root.slice();
    keyPath = undefined;

    const $ = new Proxy(resolve, {
        apply(target, context, args) {
            if (isRoot) path = root.slice();
            const result = target.apply(context, [path].concat(args));
            return result === path ? Path(target, path) : result;
        },
        get(target, key, receiver) {
            if (key === isPath) return true;

            if (key === Symbol.toPrimitive) {
                keyPath = receiver;
                return toPrimitive;
            }

            if (key === Symbol.toStringTag || key === "toString")
                return () => pathToString(path.slice());

            if (typeof key === "symbol" && wellKnownSymbols.has(key))
                return Reflect.get(target, key, receiver);

            if (isRoot) path = root.slice();

            if (key === "$path") return path;
            if (key === "$root") return root;
            if (key === "$resolve") return target;

            const step = keyPath || key;
            keyPath = undefined;

            //console.log(`(${target.name}%c#get%c)`, `color:green`, ``, path, key);
            if (isRoot) return Path(target, path.concat(step), false);

            path.push(step);

            return receiver;
        },
        has(target, key) {
            return true;
        }
    });

    return $;
}

Path.keys = arg => Path.isPath(arg) && arg.$path;
Path.isPath = arg => arg && arg[isPath] === true;
Path.extend = (path, fn) => {
    if (!fn) fn = resolve => (...args) => resolve(...args);
    return Path(fn(path.$resolve), path.$path);
};

export default Path;
