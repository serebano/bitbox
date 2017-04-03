import is from "../utils/is";
import { pathToString } from "../utils";
import { wellKnownSymbols } from "../utils";

let keyPath = null;

const isPath = Symbol("bitbox.path");
Path.isPath = arg => arg && arg[isPath] === true;

function reduce(path, target) {
    if (is.function(target)) return Path(path.concat(Array.prototype.slice.call(arguments, 1)));

    return path.reduce((obj, key) => is.function(key) ? key(obj) : obj[key], target);
}

function extend(path, construct) {
    if (!construct) construct = reducer => reducer;
    return Path(construct(path.$reducer), path.$path);
}

/**
 * Create path
 * @param  {Function}   reducer
 * @param  {Array}      [root=[]]
 * @param  {Boolean}    [isRoot=true]
 */

Path.reduce = reduce;
Path.extend = extend;

function Path(reducer, root = [], isRoot = true, object) {
    if (is.array(reducer)) return Path(reduce, reducer);
    if (is.string(reducer)) return Path(reduce, reducer.split("."));
    if (is.path(reducer)) return Path.extend(reducer, root);

    let path = keyPath ? root.concat(keyPath) : root.slice();
    keyPath = undefined;

    const $ = new Proxy(reducer, {
        apply(target, context, args) {
            if (isRoot) path = root.slice();
            const result = target.apply(context, [path].concat(args));
            return result === path ? Path(target, path) : result;
        },
        get(target, key, receiver) {
            if (key === isPath) return true;
            if (isRoot) path = root.slice();
            if (key === Symbol.toPrimitive) {
                keyPath = receiver;
                return () => pathToString(path.slice());
            }
            if (key === "$path") {
                keyPath = undefined;
                return path;
            }
            if (key === "$root") return root;
            if (key === "$reducer") return target;
            if (typeof key === "symbol" && wellKnownSymbols.has(key))
                return Reflect.get(target, key, receiver);

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

export default Path;
