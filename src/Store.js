import Tag from './Tag'
import DebuggerProvider from './providers/debugger'
import * as tags from './tags'

import Modules from './models/modules'
import Signals from './models/signals'
import State from './models/state'
import Changes from './models/changes'
import Providers from './models/providers'
import Resolve from './Resolve'
import Run from './Run'

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
        model(target, props) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            const model = target.model($(props))
            let asyncTimeout

            model.onChange = (e) => {
                clearTimeout(asyncTimeout)
                asyncTimeout = setTimeout(() => context.changes.commit())
            }

            return model
        },
        connect(target, listener, props) {
            context.changes.on(context.resolve.paths(target, ['state'], props), listener)
            listener.renew = (props) => listener.update(context.resolve.paths(target, ['state'], props))

            return listener
        }
    }
}

Store.Provider = function(store) {
    return function StoreProvider(context) {
        context.get = (target) => target.get(context)
        context.model = (target) => target.model(context)
        context.resolve = Resolve(context)

        return context
    }
}

function Store(module, store = {}) {

    const target = {}

    store.changes   = Changes(target, store)
    store.providers = Providers(target, store)
    store.state     = State(target, store)
    store.signals   = Signals(target, store)
    store.modules   = Modules(target, store)
    store.resolve   = Resolve(store)

    Object.assign(store, Model(store))

    store.providers.add(Store.Provider(store))
    store.providers.add(State.Provider(store))

    if (store.devtools)
        store.providers.add(DebuggerProvider(store))

    store.modules.add(module)

    const functionTree = Run(store)

    store.runTree = functionTree.runTree

    if (store.devtools)
        store.devtools.init(store, functionTree)

	return store
}



export default Store
