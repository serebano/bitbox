import Tag from './Tag'
import Changes from './Changes'
import * as tags from './tags'
import {getProviders} from './utils'
import ContextFactory from './Context'

function StoreProvider(store) {
    return function(context, action) {

        //context.store = store
        context.state = store.state
        context.module = store.module
        context.signal = store.signal

        context.get = (target) => target.get(context)
        context.set = (target, value) => target.set(context, value)

        return context
    }
}

function Store(init = {}, ...providers) {

    const __store = { module: {}, signal: {}, state: {} }

    const changes = new Changes()
    const store = { changes }

    store.commit = (force) => changes.commit(force)

    store.state = tags.state.model(__store, store, changes),
    store.signal = tags.signal.model(__store, store, changes)
    store.module = tags.module.model(__store, store, changes)

    store.module.set('.', init)

    const action = ContextFactory(StoreProvider(store), ...providers.concat(getProviders(__store.module)))

    store.action = (...args) => {
        action(...args)
        store.commit()
    }

    const $ctx = (props) => {
        return {
            props: props || {},
            state: store.state,
            signal: store.signal,
            module: store.module
        }
    }

    store.get = (target, props) => target.get($ctx(props))
    store.set = (target, value, props) => target.set($ctx(props), value)
    store.path = (target, props) => target.path($ctx(props))
    store.paths = (target, props) => target.paths($ctx(props))
    store.resolve = (target, props, changes) => Tag.resolve($ctx(props), target, changes)
    store.connect = (target, fn, props) => changes.add(fn, ...store.paths(target, props))

    store.run = (path, chain, props) => {
        props = props || {}
        props.root = path

        return Promise.all(chain.map(action => store.action(action, props))).then(res => changes.commit())
    }

	return store
}



export default Store
