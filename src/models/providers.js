import Model from "../model";

function Providers(target, store) {
    target.providers = target.providers || [];

    function Context(providers, ...args) {
        if (!(this instanceof Context)) return new Context(...arguments);

        return providers.reduce(
            (context, Provider) => Object.assign(context, Provider(context, ...args)),
            this
        );
    }

    return Model(target, {
        path: "providers",
        create(...args) {
            return new Context(target.providers, ...args);
        },
        get(provider) {
            return this.extract(function get(target, key) {
                if (typeof provider === "function")
                    return target[key][target[key].indexOf(provider)];

                return provider >= 0 ? target[key][provider] : target[key];
            });
        },
        keys() {
            return this.extract(function keys(target, key) {
                return target[key].map(provider => provider.displayName || provider.name);
            });
        },
        index(provider) {
            return this.extract((target, key) => target[key].indexOf(provider));
        },
        has(provider) {
            return this.extract((target, key) => target[key].indexOf(provider) > -1);
        },
        add(provider) {
            if (this.has(provider)) return;

            function add(target, key, provider) {
                target[key] = target[key].concat(provider);
            }

            return this.update(add, null, provider);
        },
        remove(provider) {
            function remove(target, key, provider) {
                target[key] = target[key].filter(i => i !== provider);
            }

            return this.update(remove, null, provider);
        },
        clear() {
            return this.update(function clear(target, key) {
                target[key] = [];
            });
        }
    });
}

export default Providers;
