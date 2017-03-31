import compute from "./compute";
import is from "./is";
//
export const isPath = Symbol("isPath");
export const toTarget = Symbol("toTarget");
export const toPrimitive = () => "";
//
let objTransfer = null;

export function apply(path, target, func, ...args) {
    return resolve(target, path).reduce(
        (obj, key, index, path) => index === path.length - 1 ? func(obj, key, ...args) : obj[key],
        target
    );
}

export function resolve(target, path) {
    path = is.path(path) ? path.path : is.array(path) ? path : [];
    const array = [];
    for (let i = 0; i < path.length; i++) {
        const key = path[i];
        if (is.path(key) || is.compute(key)) array.push(key.get(target));
        else if (is.function(key)) array.push(key(target));
        else array.push(key);
    }
    return array;
}

export function has(target, path) {
    return !is.undefined(resolve(target, path).reduce((obj, key) => obj && obj[key], target));
}

export function get(target, path, args) {
    return resolve(target, path).reduce(
        (obj, key, index, path) => {
            if (index === path.length - 1) return compute.get(target, [obj[key]].concat(args));
            return obj && obj[key];
        },
        target
    );
}

export function set(target, path, args) {
    return resolve(target, path).reduce(
        (obj, key, index, path) => {
            if (index === path.length - 1) obj[key] = compute.get(target, [obj[key]].concat(args));
            return obj && !(key in obj) ? (obj[key] = {}) : obj[key];
        },
        target
    );
}

export function toString(path) {
    if (!path.length) return `$`;
    if (path.length === 1) return is.path(path[0]) ? `${path[0].toString()}` : String(path[0]);
    return `${path.map((p, i) => is.path(p) ? `[${p.toString()}]` : i > 0 ? `.${p}` : p).join("")}`;
}

export function create(handler, path, isRoot) {
    return Path(handler, path, isRoot);
}

function Path(resolve, root = [], isRoot = true) {
    function $(...args) {
        objTransfer = undefined;
        if (is.function(resolve)) return resolve($.path, ...args);
        return $.path.reduce(
            (obj, key, idx, keys) => {
                if (is.path(key)) key = key(args[0]);
                return obj[key];
            },
            args[0]
        );
    }

    $.root = root;
    $.isRoot = isRoot;
    $.path = objTransfer ? $.root.concat(objTransfer) : $.root.slice();
    $[Symbol.isConcatSpreadable] = false;
    $.toString = () => toString($.path.slice());

    const proxy = new Proxy($, {
        has(target, key) {
            return true;
        },
        get(target, key, receiver) {
            if (Reflect.has(target, key, receiver)) return Reflect.get(target, key, receiver);
            if (key === toTarget) return target;
            if (key === isPath) return true;
            if (key === Symbol.toPrimitive) {
                objTransfer = proxy;
                return toPrimitive;
            }

            const step = objTransfer || key;
            objTransfer = undefined;

            if ($.isRoot) return Path(resolve, $.path.concat(step), false);

            $.path.push(step);

            return proxy;
        }
    });

    return proxy;
}

Path.isPath = arg => arg && arg[isPath];

export default Path;
