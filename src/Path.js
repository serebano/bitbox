class Path {
    static isPath(arg) {
        return arg instanceof Path;
    }

    static create(type) {
        return (keys, ...values) => {
            const path = new Path(type, keys, values);
            return path;
        };
    }

    /**
     * Path.resolve
     * Resolve path to array
     * path = ['state', 'users', ['props', 'id']]
     * tree = { state: { users: { foo: 'Foo' } }, props: { id: 'foo' } }
     */

    static resolve(path, tree) {
        if (Path.isPath(path)) return path.resolve(tree, true);

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

        return Path.toArray(path);
    }

    /**
     * Path.get
     * Get value from tree
     */

    static get(path, tree) {
        return Path.resolve(path, tree).reduce((target, key) => target[key], tree);
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

    static extract(target, path, trap, ...args) {
        return Path.toArray(path).reduce(
            (target, prop, index, keys) => {
                if (index === keys.length - 1) return trap.call(target, target, prop, ...args);
                return target[prop];
            },
            target
        );
    }

    constructor(type, keys, values) {
        this.type = type;
        this.keys = keys;
        if (values) this.values = values;
    }

    resolve(tree, type) {
        //this.context = tree;
        if (!this.values && this.keys) return type ? [this.type].concat(this.keys) : this.keys;
        this.path = Path.toArray(
            this.keys.reduce(
                (result, key, index) => {
                    const arg = this.values[index];
                    if (Path.isPath(arg)) return result + key + arg.get(tree);
                    return result + key + (arg || "");
                },
                ""
            )
        );
        return type ? [this.type].concat(this.path) : this.path;
    }

    getPath(context) {
        //if (!this.context) this.context = context;
        return this.resolve(context);
    }

    get(context) {
        context = context || this.context;
        const getter = context[this.type];
        if (!getter) {
            console.log(`Path/${this.type}`, context, this);
            throw new Error(`Path#${this.type} invalid getter`);
        }
        if (typeof getter === "function") return getter(this.resolve(context));

        return this.getPath(context).reduce((target, key) => target[key], getter);
    }

    set(value, context) {
        context = context || this.context;
        const target = context[this.type];
        if (!target) throw new Error(`Path#${this.type} invalid target`);
        //this.value = value;
        return Path.Proxy.extract(
            this.context,
            this.resolve(this.context, true),
            function set(target, key, value) {
                target[key] = value;
                return true;
            },
            value,
            this
        );
    }

    getPaths(func) {
        const path = func ? func(this) : this;
        const paths = path ? [path] : [];
        if (!this.values) return paths;

        return paths.concat(
            this.values.reduce(
                (paths, value) =>
                    value instanceof Path ? paths.concat(value.getPaths(func)) : paths,
                []
            )
        );
    }
}

export default Path;
