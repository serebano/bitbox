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

State.Provider = function(store) {
    return function StateProvider(context) {
        context.state = store.state

        if (context.debugger) {
            let asyncTimeout
            context.state.onChange = (e) => {
                context.debug({
                    type: 'mutation',
                    method: e.method,
                    args: [ e.path.slice(1), ...e.args ]
                })

                clearTimeout(asyncTimeout)
                asyncTimeout = setTimeout(() => store.changes.commit())

                delete context.state.onChange
            }
        }

        return context
    }
}

export default State
