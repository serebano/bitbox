import Tag from './Tag'
// models
import Modules from './models/modules'
import Signals from './models/signals'
import State from './models/state'
import Changes from './models/changes'
import Providers from './models/providers'
// providers
import DebuggerProvider from './providers/debugger'
import StoreProvider from './providers/store'
import StateProvider from './providers/state'
//
import Resolve from './Resolve'
import Run from './Run'


function Store(module, store = {}) {

    const target = {}
    const assign = (props) => Object.assign({}, store, { props: props || {} })

    Object.assign(store, {
        providers: Providers(target, store),
        changes: Changes(target, store),
        state: State(target, store),
        signals: Signals(target, store),
        modules: Modules(target, store),
        resolve: Resolve(store),
        connect(target, listener, props) {
            store.changes.on(store.resolve.paths(target, ['state'], props), listener)
            listener.renew = (props) => listener.update(store.resolve.paths(target, ['state'], props))

            return listener
        },
        model(target, props) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            let asyncTimeout

            return target.model(assign(props), {
                onChange(e) {
                    clearTimeout(asyncTimeout)
                    asyncTimeout = setTimeout(() => store.changes.commit())
                }
            })
        },
        get(target, props) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.get(assign(props))
        }
    })

    if (store.devtools)
        store.providers.add(DebuggerProvider(store))

    store.providers.add(StoreProvider(store))
    store.providers.add(StateProvider(store))

    store.modules.add(module)

    store.run = Run(store).runTree

    if (store.devtools)
        store.devtools.init(store)

	return store
}

export default Store
