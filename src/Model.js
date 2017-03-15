import Tag from "./Tag";
import Path from "./model/path";
import extract from "./model/extract";
import update from "./model/update";
import Changes from "./model/changes";
import { compute } from "./tags";
import MainProvider from "./providers/store";

Model.extract = extract;
Model.update = update;

function Resolver(context) {
    return {
        path: arg => context && arg instanceof Tag ? arg.path(context) : arg,
        value: arg => context && arg instanceof Tag ? arg.get(context) : arg
    };
}

function Model(target, path, extend, api) {
    if (typeof target === "string") return Model({}, ...arguments);

    target.changes = new Changes(target.changes);
    let asyncTimeout;

    function update(model, func, path, ...args) {
        const resolve = Resolver(model.context);

        if (typeof func !== "function")
            throw new Error(`model#update first argument must be a function`);

        const absulutePath = Path.join(model.path, path);
        const changed = Model.update(target, absulutePath, func, args.map(resolve.value));

        if (changed) {
            changed.type = model.type;
            changed.forceChildPathUpdates = func.force;

            target.changes.push(changed);

            if (model.context && model.context.debugger) {
                model.context.debugger.send({
                    type: "mutation",
                    method: `${model.type}.${changed.method}`,
                    args: [changed.path.slice(1), ...changed.args]
                });
            }

            clearTimeout(asyncTimeout);
            asyncTimeout = setTimeout(() => {
                api.flush();
                model.onChange && model.onChange(changed);
            });
        }

        return changed;
    }

    const model = {
        select(path, context, action) {
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

    const api = Object.assign(
        {
            models,
            get(target, props = {}) {
                return target.get(Object.assign({}, api, { props }));
            },
            action(action, props = {}) {
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
    );

    data.providers = [MainProvider(api)];

    return Object.keys(models).reduce(
        (api, key) => {
            const Provider = models[key] && models[key].Provider;
            const model = typeof models[key] === "function"
                ? models[key](data, key, api)
                : models[key];

            if (!model) return api;

            api[key] = Model(data, key, model, api);
            if (Provider && api.providers) api.providers.add(Provider(api));

            return api;
        },
        api
    );
};

export default Model;
