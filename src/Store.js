import Tag from './Tag'
//import Changes from './Changes'
import { createResolver } from './utils'
import { FunctionTree, sequence } from 'function-tree'
import DebuggerProvider from './providers/debugger'
import Model from './model'
import * as tags from './tags'

import Modules from './models/modules'
import Signals from './models/signals'
import State from './models/state'
import Changes from './models/changes'

function StoreProvider(store) {
    return function storeProvider(context) {
        context.get = (target) => target.get(context)
        context.set = (target, value) => target.set(context, value)
        context.apply = (target, ...args) => target.apply(context, ...args)
        context.resolve = createResolver(context)

        return context
    }
}

function Context(store, props) {
    return {
        props: props || {},
        state: store.state,
        signal: store.signals,
        module: store.modules
    }
}

function Store(init = {}) {
    const {
        devtools,
        providers = []
    } = init

    const store = {
        devtools,
        providers,
        get(target, props) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.get(Context(store, props))
        },
        set(target, value, props) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            target.set(Context(store, props), value)
            this.changes.commit()
        },
        connect(target, func, props) {
            return this.changes.on(this.resolve.paths(target, ['state'], props), func)
        },
        resolve: {
            path(target, props) {
                return target.path(Context(store, props))
            },
            paths(target, types, props) {
                return target.paths(Context(store, props), types)
            },
            value(target, props) {
                return target instanceof Tag
                    ? target.get(Context(store, props))
                    : target
            }
        }
    }

    store.state = State({}, store)
    store.signals = Signals({}, store)
    store.modules = Modules({}, store)
    store.changes = Changes({}, store)

    // add root module
    store.modules.add(null, {
        state: init.state,
        signals: init.signals,
        modules: init.modules
    })

    providers.unshift(StoreProvider(store))
    providers.unshift(store.state.provider)
    providers.push(...store.modules.getProviders())

    if (devtools)
        providers.unshift(DebuggerProvider(store))

    const functionTree = new FunctionTree(providers)

    store.runTree = functionTree.runTree

    store.run = function(action, props) {
        if (typeof action === "function") {
            return new Promise((resolve, reject) => {
                functionTree.runTree(action.name, sequence(action), props,
                    (err, exec, result) => err
                        ? reject(err)
                        : resolve(result)
                )
            })
        }

        return new Promise((resolve, reject) => {
            return functionTree.runTree(...arguments,
                (err, exec, result) => err
                    ? reject(err)
                    : resolve(result)
                )
            }
        )
    }

    store.runTree.on('asyncFunction', (e, action) => !action.isParallel && store.changes.commit())
    store.runTree.on('parallelStart', () => store.changes.commit())
    store.runTree.on('parallelProgress', (e, payload, resolving) => resolving === 1 && store.changes.commit())
    store.runTree.on('end', () => store.changes.commit())

    if (devtools) {

        devtools.init(store, functionTree)

        functionTree.on('error', function throwErrorCallback(error) {
            if (Array.isArray(functionTree._events.error) && functionTree._events.error.length > 2)
                functionTree.removeListener('error', throwErrorCallback)
            else throw error
        })
    } else {
        functionTree.on('error', function throwErrorCallback(error) {
            if (Array.isArray(functionTree._events.error) && functionTree._events.error.length > 1)
                functionTree.removeListener('error', throwErrorCallback)
            else throw error
        })
    }

    store.changes.commit()

    functionTree.emit('initialized')

	return store
}



export default Store
