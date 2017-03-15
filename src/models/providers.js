import Model from "../model";

function Providers(target, store) {
    target.providers = target.providers || [];

    return Model(target, "providers", {
        create(...args) {
            return target.providers.reduce(
                (context, Provider) => Object.assign(context, Provider(context, ...args)),
                {}
            );
        },
        get(provider) {
            return Model.get(target, this.path, function get(target, key) {
                if (typeof provider === "function")
                    return target[key][target[key].indexOf(provider)];

                return provider >= 0 ? target[key][provider] : target[key];
            });
        },
        keys() {
            return this.get((target, key) =>
                target[key].map(provider => provider.displayName || provider.name));
        },
        index(provider) {
            return this.get((target, key) => target[key].indexOf(provider));
        },
        has(provider) {
            return this.get((target, key) => target[key].indexOf(provider) > -1);
        },
        add(provider) {
            if (this.has(provider)) return;

            return this.apply(
                function add(array, provider) {
                    return array.concat(provider);
                },
                provider
            );
        },
        remove(provider) {
            function remove(array, provider) {
                return array.filter(i => i !== provider);
            }

            return this.apply(remove, provider);
        },
        clear() {
            return this.update(function clear(target, key) {
                target[key] = [];
            });
        }
    });
}

export default Providers;
