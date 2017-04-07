import Model from "../Model";
import Path from "../model/path";
import DebuggerProvider from "../providers/debugger";

function ensure(target, key, value) {
    if (!target) return undefined;

    if (!target.modules) target.modules = {};

    if (!target.modules[key]) target.modules[key] = value || {};

    return target.modules[key];
}

function Modules(target, path, store) {
    return {
        get(path) {
            return Model.get(target, Path.join(this.path, path), function get(target, key) {
                if (!target || !target.modules) return undefined;

                return target.modules[key];
            });
        },
        has(path) {
            return this.get(path) !== undefined;
        },
        add(path, desc) {
            if (
                arguments.length === 1 && (typeof path === "object" || typeof path === "function")
            ) {
                desc = path;
                path = [];
            }

            const keys = Path.keys(path);
            const length = keys.length;
            const module = typeof desc === "function"
                ? desc(
                      {
                          path: keys.join("."),
                          name: keys[length - 1]
                      },
                      store
                  ) || {}
                : desc || {};

            if (module.devtools) {
                store.devtools = module.devtools;
                store.providers.add(DebuggerProvider(store), true);
            }

            if (module.provider)
                module.providers = (module.providers || []).concat(module.provider);

            keys.reduce(
                (target, key, index) => {
                    if (index === length - 1) {
                        if (!target.modules) target.modules = {};

                        return (target.modules[key] = module);
                    } else {
                        return ensure(target, key, {});
                    }
                },
                target
            );

            // add providers
            if (module.providers)
                module.providers.forEach(provider => {
                    provider.displayName = `${keys.join(".")}.${provider.name}`;
                    store.providers.add(provider);
                });

            // set signals
            Object.keys(module.signals || {}).forEach(signalKey => {
                store.signals.add(keys.concat(signalKey), module.signals[signalKey]);
            });

            // add submodules
            Object.keys(module.modules || {}).forEach(moduleKey => {
                this.add(keys.concat(moduleKey), module.modules[moduleKey]);
            });

            // set state
            store.state.set(keys, module.state || {});

            target.changes.push({
                path: [this.type].concat(keys),
                type: this.type,
                method: "add",
                args: [desc]
            });

            if (module.devtools) {
                //store.devtools = module.devtools;
                store.devtools.init(store);
            }
            return module;
            //store.changes.commit()
        },
        remove(path) {
            Path.reduce(
                path,
                (step, key, index, keys) => {
                    if (index === keys.length - 1) {
                        const module = step.modules[key];

                        // remove submodules
                        if (module.modules)
                            Object.keys(module.modules).forEach(moduleKey => {
                                this.remove(keys.concat(moduleKey));
                            });

                        // remove providers
                        if (module.providers)
                            module.providers.forEach(provider => {
                                store.providers.remove(provider);
                            });

                        // remove signals
                        if (module.signals)
                            Object.keys(module.signals).forEach(signalKey => {
                                store.signals.remove(keys.concat(signalKey));
                            });

                        // remove state
                        store.state.remove(keys);

                        // remove this module
                        delete step.modules[key];

                        target.changes.push({
                            path: [this.type].concat(keys),
                            type: this.type,
                            method: "remove",
                            args: []
                        });

                        //store.changes.commit()
                    }

                    return step.modules[key];
                },
                target
            );
        }
    };
}

export default Modules;
