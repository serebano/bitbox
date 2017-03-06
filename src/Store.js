import Tag from './Tag'
import DebuggerProvider from './providers/debugger'
import * as tags from './tags'

import Modules from './models/modules'
import Signals from './models/signals'
import State from './models/state'
import Changes from './models/changes'
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

function Store(init) {

    const target = {}
    const store = {}

    store.changes   = Changes(target, store)
    store.state     = State(target, store)
    store.signals   = Signals(target, store)
    store.modules   = Modules(target, store)
    store.resolve   = Resolve(store)

    Object.assign(store, Model(store))

    const {
        devtools,
        providers = []
    } = store.modules.add(init)

    store.devtools = devtools

    providers.unshift(Store.Provider(store))
    providers.unshift(State.Provider(store))

    if (devtools)
        providers.unshift(DebuggerProvider(store))

    store.providers = providers.concat(store.modules.getProviders())

    const functionTree = Run(store)

    store.runTree = functionTree.runTree

    if (devtools)
        devtools.init(store, functionTree)

    store.changes.commit()

	return store
}



export default Store
