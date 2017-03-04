import Tag from './Tag'
import { FunctionTree, sequence } from 'function-tree'
import DebuggerProvider from './providers/debugger'
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

        context.resolve = Resolve(context)
        context.model = Model(context)

        return context
    }
}

function Model(context) {
    const $ = (props) => props
        ? Object.assign({}, context, { props })
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

            target.apply($(), func, ...args)
            context.changes && context.changes.commit()
        },
        connect(target, listener, props) {
            return context.changes && context.changes.on(
                context.resolve.paths(target, ['state'], props),
                listener
            )
        }
    }
}


function Resolve(context) {
    const $ = (context, props) => props ? Object.assign({}, context, { props }) : context

    return {
        type(target) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.type
        },
        path(target, props) {
            return target.path($(context, props))
        },
        paths(target, types, props) {
            if (Array.isArray(target))
                return target

            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.paths($(context, props), types)
        },
        value(target, props) {
            return target instanceof Tag
                ? target.get($(context, props))
                : target
        },
        model(target) {
            if (!(target instanceof Tag))
                throw new Error(`Invalid target: ${target}`)

            return target.model(context)
        }
    }
}

function Run(store) {
    const functionTree = new FunctionTree(store.providers)
    const runTree = functionTree.runTree

    functionTree.run = function(action, props) {
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

    runTree.on('asyncFunction', (e, action) => !action.isParallel && store.changes.commit())
    runTree.on('parallelStart', () => store.changes.commit())
    runTree.on('parallelProgress', (e, payload, resolving) => resolving === 1 && store.changes.commit())
    runTree.on('end', () => store.changes.commit())

    if (store.devtools) {

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

    functionTree.emit('initialized')

    return functionTree
}

function Store(init = {}) {

    const store = {
        devtools: init.devtools,
        providers: init.providers || []
    }

    const state = State({}, store)
    const signals = Signals({}, store)
    const modules = Modules({}, store)
    const changes = Changes({}, store)
    const resolve = Resolve(store)

    Object.assign(store, Model(store), { state, signals, modules, changes, resolve })


    // add root module
    modules.add({
        state: init.state,
        signals: init.signals,
        modules: init.modules
    })

    store.providers.unshift(StoreProvider(store))
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
