import Model from '../model'

function State(target, store) {

    return Model(target, {
        path: 'state',
        keys(path) {
            return this.extract(path, function keys(target, key) {
                return Object.keys(target[key])
            })
        },
        values(path) {
            return this.extract(path, function values(target, key) {
                return Object.values(target[key])
            })
        },
        push(path, ...args) {
            return this.apply(path, function push(target, key, ...values) {
                if (!(key in target))
                    target[key] = []

                target[key].push(...values)
            }, ...args)
        }
    })
}

export default State
