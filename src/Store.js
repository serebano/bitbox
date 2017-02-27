import Tag from './Tag'
import Changes from './Changes'
import * as tags from './tags'
import {getProviders} from './utils'
import ContextFactory from './Context'

function StoreContextProvider(store) {
    return function(context, action, props) {
        context.store = store
        context.state = store.state
        context.get = (target) => store.get(target, context.props)
        context.set = (target, value) => store.set(target, value, context.props)

        return context
    }
}

function Store(init = {}, ...providers) {

    const __store = {
        module: {},
        state: {}
    }


    const $ctx = (props) => Object.assign({}, __store, { store, props, state: store.state })

    tags.module(".").set(__store, init)

    const changes = new Changes()
	const store = {
        state: tags.state.create(__store, changes)
    }

    providers.unshift(StoreContextProvider(store))

    const $ = ContextFactory(...providers.concat(getProviders(__store.module)))
    store.action = $

    const emit = (path, target) => {
        changes.emit(path)
        if (target.type === "module")
            $.providers = providers.concat(getProviders(__store.module))
    }

    store.path = (target, props) => target.path($ctx(props))
    store.paths = (target, props) => target.paths($ctx(props))
    store.get = (target, props) => target.get($ctx(props))
    store.set = (target, value, props) => target.set($ctx(props), value, p => emit(p, target))
    store.resolve = (target, props) => Tag.resolve($ctx(props), target)
    store.connect = (target, fn, props) => changes.add(fn, ...store.paths(target, props))

    store.run = (name, chain, props) => {
        props = props || {}
        //const signal = store.get(target, props)
        //props.root = signal.path

        return Promise.all(chain.map(action => store.action(action, props)))
    }

	return store
}



export default Store
