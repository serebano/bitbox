import Tag from './Tag'
import DebuggerProvider from './providers/debugger'
import * as tags from './tags'

import Modules from './models/modules'
import Signals from './models/signals'
import State from './models/state'
import Changes from './models/changes'
import Resolve from './Resolve'
import Run from './Run'

Store.Provider = function(store) {
    return function StoreProvider(context) {
        context.resolve = Resolve(context)

        return Object.assign(context, Model(context))
    }
}

function Model(context) {
    const $ = (props) => props
        ? Object.assign({}, context, { props })
        : !context.props
            ? Object.assign({ props: {} }, context)
            : context

    return {
        get(target, props) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.get($(props))
        },
        set(target, value, props) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            target.set($(props), value)
            context.changes && context.changes.commit()
        },
        apply(target, func, ...args) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            const result = target.apply($(), func, ...args)
            context.changes && context.changes.commit()

            return result
        },
        connect(target, listener, props) {
            if (context.changes) {
                context.changes.on(
                    context.resolve.paths(target, ['state'], props),
                    listener
                )
                listener.renew = (props) => listener.update(context.resolve.paths(target, ['state'], props))

                return listener
            }
        }
    }
}

function Create(store = {}) {
    store.changes   = Changes({}, store)

    store.state     = State({}, store)
    store.signals   = Signals({}, store)
    store.modules   = Modules({}, store)
    store.resolve   = Resolve(store)

    return Object.assign(store, Model(store))
}

Store.Create = Create

function Store(init) {

    const store = Create({})

    const {
        devtools,
        providers = []
    } = store.modules.add(init)

    store.devtools = devtools
    store.providers = providers

    store.providers.unshift(Store.Provider(store))
    store.providers.unshift(store.state.provider)

    if (store.devtools)
        store.providers.unshift(DebuggerProvider(store))

    store.providers = store.providers.concat(store.modules.getProviders())

    const functionTree = Run(store)

    store.runTree = functionTree.runTree

    if (store.devtools)
        store.devtools.init(store, functionTree)

    store.changes.commit()

	return store
}



export default Store
