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

    static get(target, path, view) {
        return Path.resolve(path, target).reduce((target, key) => target[key], target);
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

    static reduce(target, path, func) {
        return Path.resolve(path, target).reduce(func, target);
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

    static populate(path, target) {
        return Path.join(
            path.type,
            path.keys.reduce(
                (result, key, index) => {
                    const arg = path.values[index];
                    if (arg instanceof Path) return result + key + Path.select(arg, target);

                    return result + key + (arg || "");
                },
                ""
            )
        );
    }

    static select(path, target, props) {
        const getters = props ? Object.assign({ props }, target) : target;

        if (path instanceof Path) {
            //if (path.get) return path.get(getters);

            return Path.populate(path, getters).reduce((target, key) => target[key], getters);
        }

        return Path.toArray(path).reduce((target, key) => target[key], getters);
    }

    static resolve(path, target, props) {
        if (path instanceof Path) {
            const getters = props ? Object.assign({ props }, target) : target;
            return Path.populate(path, getters);
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
    }

    get(tree) {
        return Path.select(this, tree);
    }

    resolve(tree) {
        return Path.resolve(this, tree);
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
