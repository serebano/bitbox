import is from "../utils/is";

let keyPath = null;

const Path = {};
const methods = ["push", "pop", "key", "extend"];

Path.key = Symbol.for("Path.key");
Path.keys = Symbol.for("Path.keys");
Path.root = Symbol.for("Path.root");
Path.isRoot = Symbol.for("Path.isRoot");
Path.reducer = Symbol.for("Path.reducer");
Path.setter = Symbol.for("Path.setter");

Path.create = create;
Path.extend = extend;
Path.isPath = isPath;
Path.get = get;
Path.map = new Map();

export function get(target, key) {
    return Reflect.get(target, Path[key]);
}

export function isPath(path) {
    return is.function(path) && Reflect.has(path, Path.keys);
}

export function extend(target, construct) {
    const reducer = get(target, "reducer");
    const root = get(target, "keys");
    const path = create(construct(reducer), root, true);

    Path.map.get(reducer).set(root.slice().pop(), path);

    return path;
}

/**
 * Create path
 * @param  {Function}   reducer
 * @param  {Array}      [root=[]]
 * @param  {Boolean}    [isRoot=true]
 */

export function create(reducer, root = [], isRoot = true) {
    keyPath = undefined;
    const proxy = PathProxy(path);

    function path() {
        keyPath = undefined;
        if (path[Path.isRoot]) Reflect.set(path, Path.keys, path[Path.root].slice());

        return reducer.call(path, proxy, ...arguments);
    }

    if (!Path.map.has(reducer)) Path.map.set(reducer, new Map());

    path[Path.setter] = undefined;
    path[Path.reducer] = reducer;
    path[Path.isRoot] = isRoot;
    path[Path.root] = root.slice();
    path[Path.keys] = keyPath ? path[Path.root].concat(keyPath) : path[Path.root];

    path[Symbol.iterator] = () => PathIterator(Path.get(path, "keys"));
    path[Symbol.toPrimitive] = () => toString(Path.get(path, "keys"));
    path[Symbol.isConcatSpreadable] = false;

    return proxy;
}

function PathProxy(path) {
    const proxy = new Proxy(path, {
        get(target, key, receiver) {
            //console.log(`get ->`, target[SymbolPath], key);
            const isRoot = Path.get(target, "isRoot");
            const reducer = Path.get(target, "reducer");

            if (isRoot && Path.map.get(reducer).has(key)) return Path.map.get(reducer).get(key);

            if (key === Symbol.hasInstance)
                return obj => obj && Path.get(obj, "reducer") === Path.get(target, "reducer");

            if (key === Symbol.toPrimitive) {
                keyPath = target;
                return Reflect.get(target, Symbol.toPrimitive);
            }

            if (
                (typeof key === "symbol" || key === "apply" || key === "call") &&
                Reflect.has(target, key)
            )
                return Reflect.get(target, key);

            // reset path
            if (isRoot) Reflect.set(target, Path.keys, Path.get(target, "root").slice());

            if (key === "displayName") return Reflect.get(target, Symbol.toPrimitive)();

            if (key === "length") return Path.get(target, "keys").length;

            if (key.charAt(0) === "$") {
                const reducer = Path.get(target, "reducer");
                //if (Reflect.has(reducer, key)) return Reflect.get(reducer, key);

                const method = key.replace("$", "");

                if (methods.includes(method)) {
                    if (method === "key") {
                        return Path.get(target, "keys").slice().pop();
                    }

                    if (method === "extend") {
                        return construct => extend(target, construct);
                        // return function extend(construct) {
                        //     return Path.create(
                        //         construct
                        //             ? construct(Path.get(target, "reducer"))
                        //             : Path.get(target, "reducer"),
                        //         Path.get(target, "keys"),
                        //         true
                        //     );
                        // };
                    }
                    if (method === "pop") {
                        return () => Path.get(target, "keys").pop();
                    }
                    if (method === "push") {
                        return function push() {
                            const keys = Path.get(target, "keys");
                            keys.push(...arguments);

                            return isRoot
                                ? Path.create(Path.get(target, "reducer"), keys, false)
                                : proxy;
                        };
                    }
                }

                return Reflect.get(reducer, method);
            }

            if (keyPath === undefined) {
                Path.get(target, "keys").push(key);
            } else {
                Path.get(target, "keys").push(keyPath);
                keyPath = undefined;
            }

            return isRoot
                ? Path.create(Path.get(target, "reducer"), Path.get(target, "keys"), false)
                : proxy;
        },
        has() {
            return true;
        }
    });

    return proxy;
}

function PathIterator(array) {
    return {
        index: 0,
        next() {
            return this.index < array.length
                ? { value: array[this.index++], done: false }
                : { done: true };
        }
    };
}

export function resolve(path, ...args) {
    return is.path(path) ? path(...args) : path;
}

export function reduce(path, target) {
    return is.function(target)
        ? Path.create(path.concat(Array.prototype.slice.call(arguments, 1)))
        : path.reduce((obj, key) => is.function(key) ? key(obj) : obj[key], target);
}

function toString(path, hint) {
    let f = false;
    if (!path.length) return `$`;
    if (path.length === 1)
        return is.path(path[0]) ? `${toString(Path.get(path[0], "keys"))}` : path[0];
    return `${path
        .map(
            (p, i) =>
                is.path(p)
                    ? `[${toString(Path.get(p, "keys"))}]`
                    : is.function(p) ? f ? `(${p})` : `` : i > 0 ? `.${p}` : p
        )
        .join("")}`;
}

export default Path;
