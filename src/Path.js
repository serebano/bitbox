import Listener from "./models/listeners";
function isComplexObject(obj) {
    return typeof obj === "object" && obj !== null;
}

class Path {
    static isPath(arg) {
        return arg instanceof Path;
    }

    static tag(type) {
        return (keys, ...values) => new Path(type, keys, values);
    }

    static Listener = Listener;
    static connect = Listener.connect;
    static changes = Listener.changes;
    static flush = Listener.flush;
    static listeners = Listener.get;

    /**
     * Path.resolve
     * Resolve path from target
     * path = ['state', 'users', ['props', 'id']]
     * target = { state: { users: { foo: 'Foo' } }, props: { id: 'foo' } }
     */

    static resolve(path, getters) {
        if (Array.isArray(path)) {
            return path.reduce(
                (result, key, index) => {
                    if (Array.isArray(key)) return result.concat(Path.get(getters, key));
                    if (Path.isPath(key)) return result.concat(key.get(getters));

                    return result.concat(key);
                },
                []
            );
        }

        if (Path.isPath(path)) return [path.type].concat(path.resolve(getters));

        return Path.toArray(path);
    }

    static join(...path) {
        return path.reduce(
            (keys, key, index, path) => {
                if (!key || key === "") return keys;
                return keys.concat(Path.resolve(key));
            },
            []
        );
    }

    static reduce(path, func, target) {
        return Path.resolve(path, target).reduce(func, target);
    }

    /**
     * Path.get
     * Get value by path
     */

    static get(target, path, view) {
        return Path.reduce(path, (target, key) => target[key], target);
    }

    /**
     * Path.update
     * Update target by path
     */

    static update(target, path, method, args = [], options = {}) {
        return Path.resolve(path, target).reduce(
            (object, key, index, path) => {
                if (index === path.length - 1) {
                    const oldValue = object[key];
                    method(object, key, ...args);
                    const newValue = object[key];

                    if (
                        oldValue !== newValue ||
                        (isComplexObject(newValue) && isComplexObject(oldValue))
                    )
                        return target.changes.push(
                            path,
                            method.displayName || method.name,
                            args,
                            options
                        );
                } else if (!(key in object)) {
                    object[key] = {};
                }

                return object[key];
            },
            target
        );
    }

    static set(target, path, value) {
        return Path.update(
            target,
            path,
            function set(target, key, value) {
                target[key] = value;
            },
            [value]
        );
    }

    // static select(path, target, props) {
    //     const getters = props ? Object.assign({ props }, target) : target;
    //     if (path instanceof Path) {
    //         //if (path.get) return path.get(getters);
    //         return Path.populate(path, getters).reduce((target, key) => target[key], getters);
    //     }
    //     return Path.toArray(path).reduce((target, key) => target[key], getters);
    // }

    static detailed(path, target, props) {
        if (path instanceof Path) {
            const resolved = Path.populate(path, props ? Object.assign({ props }, target) : target);
            const fullPath = Path.join(path.type, resolved);
            return {
                type: path.type,
                path,
                resolved,
                fullPath
            };
        }

        return Path.toArray(path);
    }

    static toArray(path = []) {
        if (Array.isArray(path)) {
            return path;
        } else if (typeof path === "string") {
            return path === "." || path === "" ? [] : path.split(".");
        } else if (typeof path === "number") {
            return [String(path)];
        }

        return [];
    }

    static keys(path = []) {
        if (Array.isArray(path)) {
            return path;
        } else if (typeof path === "string") {
            return path === "." || path === "" ? [] : path.split(".");
        } else if (typeof path === "number") {
            return [String(path)];
        }

        return [];
    }

    constructor(type, keys, values) {
        this.type = type;
        this.keys = keys;
        this.values = values;
        this.hasPath = true;
    }

    resolve(target) {
        return Path.toArray(
            this.keys.reduce(
                (result, key, index) => {
                    const arg = this.values[index];
                    if (Path.isPath(arg)) return result + key + arg.get(target);
                    if (Array.isArray(arg)) return result + key + Path.get(target, arg);

                    return result + key + (arg || "");
                },
                ""
            )
        );
    }

    get(target) {
        return Path.get(target[this.type], this.resolve(target));
    }

    paths(tree, types) {
        return this.extract(types).filter(tag => tag.hasPath).map(path => path.resolve(tree));
    }

    extract(types) {
        const match = !types || !types.length || types.indexOf(this.type) > -1;

        return (match ? [this] : []).concat(
            this.values.reduce(
                (paths, value, index) => {
                    return value instanceof Path ? paths.concat(value.extract(types)) : paths;
                },
                []
            )
        );
    }
}

export default Path;
