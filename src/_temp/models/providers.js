function Providers(target = {}, path, api) {
    target.providers = target.providers || [];

    return {
        context(...args) {
            this.get(providers => {
                return providers.reduce(
                    (context, Provider) => {
                        const newcontext = Provider(context, ...args);
                        if (newcontext !== context) throw new Error("Provider must return context");

                        return newcontext;
                    },
                    {}
                );
            });
        },
        getProvider(provider) {
            return this.get(providers => providers[this.indexOf(provider)]);
        },
        keys() {
            return this.get(providers =>
                providers.map(provider => provider.displayName || provider.name));
        },
        indexOf(provider) {
            return this.get(providers => providers.indexOf(provider));
        },
        has(provider) {
            return this.get(providers => providers.indexOf(provider) > -1);
        },
        add(provider, top) {
            if (this.has(provider)) return;

            return this.apply(
                function add(providers, provider, top) {
                    if (top) return [provider].concat(providers);
                    return providers.concat(provider);
                },
                provider,
                top
            );
        },
        remove(provider) {
            return this.apply(
                function remove(array, provider) {
                    return array.filter(i => i !== provider);
                },
                provider
            );
        },
        clear() {
            return this.apply(function clear() {
                return [];
            });
        }
    };
}

export default Providers;
