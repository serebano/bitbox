import Model from '../model'

function Providers(target, store) {

    target.providers = target.providers || []

    return Model(target, {
        path: 'providers',
        get(provider) {
            return this.extract(null , function get(target, key, provider) {
                if (typeof provider === "function")
                    return target[key][target[key].indexOf(provider)]

                return provider >= 0 ? target[key][provider] : target[key]
            }, provider)
        },
        keys() {
            return this.extract(null, function keys(target, key) {
                return target[key].map(provider => provider.displayName || provider.name)
            })
        },
        index(provider) {
            return this.extract(null , function index(target, key, provider) {
                return target[key].indexOf(provider)
            }, provider)
        },
        has(provider) {
            return this.extract(null , function has(target, key, provider) {
                return target[key].indexOf(provider) > -1
            }, provider)
        },
        add(provider) {
            if (!this.has(provider))
                return this.apply(null, function add(target, key, provider) {
                    target[key].push(provider)
                }, provider)
        },
        remove(provider) {
            this.apply(null, function remove(target, key, provider) {
                target[key].splice(target[key].indexOf(provider), 1)
            }, provider)
        },
        clear() {
            this.apply(null, function clear(target, key) {
                target[key] = []
            })
        }
    })
}

export default Providers
