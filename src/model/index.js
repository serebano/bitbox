import Tag from "../Tag";
import Path from "../model/path";
import apply from "../model/apply";
import extract from "../model/extract";
import Changes from "../model/changes";
import { compute } from "../tags";

Model.get = extract;
Model.update = apply;

Model.create = function(models, ext) {
    const data = {};

    return Object.keys(models).reduce(
        (api, key) => {
            const model = models[key];
            api[key] = typeof model === "function"
                ? model(data, key, api)
                : Model(data, key, model, api);

            return api;
        },
        Object.assign(
            function run(action, props) {
                return action(
                    Object.assign({}, run, {
                        props: props || {}
                    })
                );
            },
            {
                get(target) {
                    return target.get(this);
                },
                select(target) {
                    return target.select(this);
                },
                create(target, model) {
                    const path = target.path(this, true);
                    Model.update(
                        this,
                        path,
                        function createModel(target, key, model) {
                            target[key] = model;
                        },
                        [
                            typeof model === "function"
                                ? model(data, path, this)
                                : Model(data, path, model, this)
                        ]
                    );
                    return this;
                },
                on(target, listener) {
                    const tag = compute(target);
                    const api = this;
                    const connection = this.listeners.connect(
                        tag.paths(this),
                        function Listener(c) {
                            connection.update(tag.paths(api));
                            listener(tag.get(api));
                        }
                    );

                    return connection;
                },
                connect(target, listener) {
                    this.listeners.connect(compute(target).paths(this), listener);
                },
                flush(force) {
                    return this.listeners.flush(force);
                }
            },
            ext
        )
    );
};

Model.push = function push(path, ...args) {
    return this.apply(
        path,
        function push(array = [], ...args) {
            array.push(...args);

            return array;
        },
        ...args
    );
};

Model.unshift = function unshift(path, ...args) {
    return this.apply(
        path,
        function unshift(array = [], ...args) {
            array.unshift(...args);

            return array;
        },
        ...args
    );
};

function Resolver(context) {
    return {
        path: arg => context && arg instanceof Tag ? arg.path(context) : arg,
        value: arg => context && arg instanceof Tag ? arg.get(context) : arg
    };
}

function Model(target, path, extend) {
    if (typeof target === "string") return Model({}, ...arguments);

    target.changes = new Changes(target.changes);

    function update(model, func, path, ...args) {
        const resolve = Resolver(model.context);

        if (typeof func !== "function")
            throw new Error(`model#update first argument must be a function`);

        const absulutePath = Path.join(model.path, path);
        const changed = Model.update(target, absulutePath, func, args.map(resolve.value));

        if (changed) {
            if (func.force) changed.forceChildPathUpdates = true;
            changed.type = model.type;
            //changed.path = [model.path, path, absulutePath];

            target.changes.push(changed);
            model.onChange && model.onChange(changed);
        }

        return changed;
    }

    const model = {
        select(path, context) {
            return Object.create(this, {
                path: {
                    value: Path.join(this.path, path).join("."),
                    writable: false
                },
                context: {
                    value: context,
                    enumerable: false,
                    writable: false
                }
            });
        },
        get(path, view, ...args) {
            if (typeof path === "function") return this.get(null, ...arguments);

            return Model.get(
                target,
                Path.resolve(this.path, path),
                (target, key, ...args) => view ? view(target[key], ...args) : target[key],
                args
            );
        },
        has(path) {
            return Model.get(target, Path.resolve(this.path, path), (target, key) => key in target);
        },
        set(path, value) {
            if (arguments.length === 1) return this.set(null, ...arguments);

            function set(target, key, value) {
                target[key] = value;
            }

            return update(this, set, path, value);
        },
        unset(path) {
            function unset(target, key) {
                delete target[key];
            }

            return update(this, unset, path);
        },
        apply(path, func, ...args) {
            if (typeof path === "function" || path instanceof Tag)
                return this.apply(null, ...arguments);

            if (func instanceof Tag) {
                const tag = (target, key, value) => {
                    target[key] = value;
                };
                if (func.name) tag.displayName = "compute#" + func.name;

                return update(this, tag, path, func);
            }

            const fn = (target, key, ...args) => {
                target[key] = func(target[key], ...args);
            };

            fn.displayName = func.name;

            return update(this, fn, path, ...args);
        },
        ...extend
    };

    return Object.create(model, {
        type: {
            value: path,
            writable: false
        },
        path: {
            value: path,
            writable: false
        },
        context: {
            value: null,
            enumerable: false,
            writable: false
        }
    });
}

export default Model;
