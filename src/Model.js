import Tag from "./Tag";
import Path from "./model/path";
import extract from "./model/extract";
import update from "./model/update";
import Changes from "./model/changes";
import { compute } from "./tags";

Model.extract = extract;
Model.update = update;

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
            target.changes.push(changed);
            model.onChange && model.onChange(changed);
        }

        return changed;
    }

    const model = {
        select(path, context) {
            return Object.create(this, {
                path: {
                    value: Path.join(this.path, path),
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

            return Model.extract(
                target,
                Path.resolve(this.path, path),
                (target, key, ...args) => view ? view(target[key], ...args) : target[key],
                args
            );
        },
        has(path) {
            return Model.extract(
                target,
                Path.resolve(this.path, path),
                (target, key) => key in target
            );
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
            value: Path.keys(path),
            writable: false
        }
    });
}

Model.create = function create(models, extend) {
    const data = {};

    const api = Object.keys(models).reduce(
        (api, key) => {
            const model = typeof models[key] === "function"
                ? models[key](data, key, api)
                : models[key];

            api[key] = Model(data, key, model, api);

            return api;
        },
        Object.assign(
            {
                get(target, props = {}) {
                    return target.get(Object.assign({}, api, { props }));
                },
                run(action, props = {}) {
                    return action(Object.assign({}, api, { props }));
                },
                select(target, props = {}) {
                    return target.select(Object.assign({}, api, { props }));
                },
                create(target, mod) {
                    const path = target.path(api, true);
                    const model = typeof mod === "function" ? mod(data, path, api) : mod;

                    Model.update(
                        api,
                        path,
                        function set(target, key, model) {
                            target[key] = model;
                        },
                        [Model(data, path, model, api)]
                    );

                    return api;
                },
                on(target, listener) {
                    const tag = compute(target);
                    const connection = this.listeners.connect(tag.paths(api), function Listener(c) {
                        connection.update(tag.paths(api));
                        listener(tag.get(api));
                    });

                    return connection;
                },
                connect(map, listener) {
                    const tag = compute(map);
                    const paths = (props = {}) =>
                        tag.paths(Object.assign({}, api, { props }), ["state"]);
                    const conn = api.listeners.connect(paths(), listener);

                    return {
                        get: props => api.get(tag, props),
                        update: props => conn.update(paths(props)),
                        remove: () => conn.remove()
                    };
                },
                flush(force) {
                    return api.listeners.flush(force);
                }
            },
            extend
        )
    );

    return api;
};

export default Model;
