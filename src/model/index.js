import Tag from "../Tag";
import Path from "../model/path";
import apply from "../model/apply";
import extract from "../model/extract";
import Changes from "../model/changes";

Model.get = extract;
Model.update = apply;

Model.changes = array => new Changes(array);

Model.compose = (...models) => {
    const api = {
        get(target, view) {
            if (!(target instanceof Tag)) return view ? view(target) : target;
            return target.get(api, view);
        },
        select(target) {
            return target.resolve(api).select(target.path(api));
        }
    };

    const target = {};

    return models.reduce(
        (api, Model) => {
            const model = Model(target, api);

            if (typeof model === "function")
                api[Model.name.toLowerCase()] = model;
            else
                apply(api, Path.resolve(model.path), (target, key) => {
                    target[key] = model;
                });
            return api;
        },
        api
    );
};

function Model(target = {}, extend, api) {
    target.changes = new Changes(target.changes);

    const resolve = {
        value: (arg, view) => arg instanceof Tag ? arg.get(api, view) : arg,
        path: (arg, abs) => arg instanceof Tag ? arg.path(api, abs) : arg,
        args: args => args.map(resolve.value)
    };

    const model = Object.assign(
        {
            path: "",
            get(path, view) {
                return this.extract((target, key) => view ? view(target[key]) : target[key], path);
            },
            has(path) {
                return this.extract((target, key) => key in target, path);
            },
            set(path, value) {
                if (arguments.length === 1) return this.set(null, ...arguments);

                function set(target, key, value) {
                    target[key] = value;
                }

                return this.update(set, path, value);
            },
            unset(path) {
                function unset(target, key) {
                    delete target[key];
                }

                return this.update(unset, path);
            },
            select(path, extend) {
                return Object.assign(
                    {},
                    this,
                    {
                        path: Path.resolve(this.path, path)
                    },
                    extend
                );
            },
            extract(func, path, ...args) {
                if (typeof func !== "function")
                    throw new Error(`model#extract first argument must be a function`);

                return Model.get(target, Path.resolve(this.path, path), func, resolve.args(args));
            },
            update(func, path, ...args) {
                if (typeof func !== "function")
                    throw new Error(`model#update first argument must be a function`);

                const changed = Model.update(
                    target,
                    Path.resolve(this.path, path),
                    func,
                    resolve.args(args)
                );

                if (changed) {
                    if (func.force) changed.forceChildPathUpdates = true;

                    target.changes.push(changed);
                    this.onChange && this.onChange(changed);
                }

                return changed;
            },
            apply(path, func, ...args) {
                if (typeof path === "function") return this.apply(null, ...arguments);

                const applyFn = (target, key, ...args) => {
                    target[key] = func(target[key], ...args);
                };
                applyFn.displayName = func.name;

                return this.update(applyFn, path, ...args);
            }
        },
        extend
    );

    return model;
}

export default Model;
