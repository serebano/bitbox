class Path {
    static KEY = Symbol("Path");
    static isPath(arg) {
        return arg instanceof Path;
    }

    static create(type) {
        return (keys, ...values) => new Path(type, keys, values);
    }

    /**
     * Path.resolve
     * Resolve path to array
     * path = ['state', 'users', ['props', 'id']]
     * tree = { state: { users: { foo: 'Foo' } }, props: { id: 'foo' } }
     */

    static resolve(path, tree) {
        if (Array.isArray(path)) {
            return path.reduce(
                (result, key, index) => {
                    if (Array.isArray(key)) return result.concat(Path.get(key, tree));
                    if (Path.isPath(key)) return result.concat(key.get(tree));

                    return result.concat(key);
                },
                []
            );
        }

        if (Path.isPath(path)) return path.resolve(tree);

        return Path.toArray(path);
    }

    static reduce(path, func, tree) {
        if (!tree) return tree => Path.reduce(path, func, tree);
        return Path.resolve(path, tree).reduce(func, tree);
    }

    /**
     * Path.get
     * Get value from tree
     */

    static get(path, tree) {
        return Path.reduce(path, (target, key) => target[key], tree);
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

    static ensure(path) {
        if (Path.isPath(path)) return path;
        if (typeof path === "function") return path;
        const [type, ...keys] = Path.toArray(path);

        return new Path(type, [keys.join(".")]);
    }

    constructor(type, keys, values) {
        this.type = type;
        this.keys = keys;
        this.values = values || [];
    }

    resolve(tree, relative) {
        const path = Path.toArray(
            this.keys.reduce(
                (result, key, index) => {
                    const arg = this.values[index];
                    if (Path.isPath(arg)) return result + key + arg.get(tree);
                    if (Array.isArray(arg)) return result + key + Path.get(arg, tree);

                    return result + key + (arg || "");
                },
                ""
            )
        );
        return relative ? path : [this.type].concat(path);
    }

    get(tree) {
        if (tree.get) return tree.get(this);
        return Path.get(this.resolve(tree), tree);
    }

    paths(func) {
        const path = func ? func(this) : this;
        return (path ? [path] : []).concat(
            this.values.reduce(
                (paths, value) => value instanceof Path ? paths.concat(value.paths(func)) : paths,
                []
            )
        );
    }
}

export default Path;
