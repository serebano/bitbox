import Path from './path'
import apply from './apply'
import extract from './extract'
import baseHandler from './handler'

function Model(target, store, root) {
    return {
        get(path, view) {
            return this.extract(path, function get(target, key) {
                return view
                    ? view(target[key])
                    : target[key]
            }, view)
        },
        set(path, value) {
            return this.apply(path, function set(target, key, value) {
                target[key] = value

                return true
            }, value)
        },
        has(path) {
            return this.extract(path, function has(target, key) {
                return (key in target)
            })
        },
        keys(path) {
            return this.extract(path, function keys(target, key) {
                return Object.keys(target[key])
            })
        },
        extract(path, view, ...args) {
            return extract(target, Path.resolve(root, path), view, ...args)
        },
        apply(path, trap, ...args) {
            const changed = apply(target, Path.resolve(root, path), trap, ...args)
            if (changed && store && store.changes)
                store.changes.push(changed)

            return changed
        },
        provider(context, action) {
            context[root] = this
            if (context.debugger) {
                const model = Model(target, store, root)
                const apply = model.apply
                delete model.provider

                context[root] = Object.assign(model, {
                    apply(...args) {
                        const changed = apply(...args)
                        if (changed && context.debug) {
                            context.debug({
                                type: 'mutation',
                                method: changed.method,
                                args: [ changed.path.slice(1), ...changed.args ]
                            })
                        }
                    }
                })
            }

            return context
        }
    }
}

export default Model
