import Tag from './Tag'
import Changes from './Changes'
import { createResolver } from './utils'
import { FunctionTree, sequence } from 'function-tree'
import DebuggerProvider from './providers/debugger'
import Model from './Model'
import * as tags from './tags'

function StoreProvider(store) {
    return function storeProvider(context) {
        context.get = (target, transform) => target.get(context, transform)
        context.set = (target, value) => target.set(context, value)
        context.update = (target, ...args) => target.update(context, ...args)
        context.resolve = createResolver(context)

        return context
    }
}

function Store(init = {}, ...providers) {

    const devtools = init.devtools
    const changes = new Changes({ devtools })
    const store = { changes, devtools, providers }

    store.state = Model('state', {}, store)
    store.signal = Model('signal', {}, store)

    store.module = tags.module.model({module: {}}, store, changes)

    function Context(props) {
        return {
            props: props || {},
            state: store.state,
            signal: store.signal,
            module: store.module
        }
    }

    store.context = Context

    store.get = function get(target, transform, props) {
        if (!(target instanceof Tag))
            throw new Error(`Invalid target: ${target}`)

        if (typeof transform === "object") {
            props = transform
            transform = undefined
        }

        return target.get(Context(props), transform)
    }

    store.set = function set(target, value, props) {
        target.set(Context(props), value)
        changes.commit()
    }

    store.resolve = {}
    store.resolve.path = (target, props) => target.path(Context(props))
    store.resolve.paths = (target, types, props) => target.paths(Context(props), types)
    store.resolve.value = (target, props) => target instanceof Tag ? target.get(Context(props)) : target

    store.connect = (target, func, props) => changes.connect(store.resolve.paths(target, ['state'], props), func)

    store.commit = (force) => {
        return changes.commit(force)
    }

    providers.unshift(StoreProvider(store))
    providers.unshift(store.state.provider())
    providers.unshift(store.signal.provider())
    providers.push(...store.module.providers())

    if (devtools)
        providers.unshift(DebuggerProvider(store))

    const functionTree = new FunctionTree(providers)
    const run = functionTree.runTree

    store.run = function(action, props) {
        if (typeof action === "function") {
            return new Promise((resolve, reject) => {
                run(action.name, sequence(action), props,
                    (err, exec, result) => err
                        ? reject(err)
                        : resolve(result)
                )
            })
        }

        return new Promise((resolve, reject) => {
            return run(...arguments,
                (err, exec, result) => err
                    ? reject(err)
                    : resolve(result)
                )
            }
        )
    }

    Model.assign(store.signal, tags.signal.methods(store.run))

    run.on('asyncFunction', (execution, action) => !action.isParallel && store.commit())
    run.on('parallelStart', () => store.commit())
    run.on('parallelProgress', (execution, payload, functionsResolving) => functionsResolving === 1 && store.commit())
    run.on('end', () => store.commit())

    if (devtools) {

        devtools.init(store, functionTree)

        functionTree.on('error', function throwErrorCallback(error) {
            if (Array.isArray(functionTree._events.error) && functionTree._events.error.length > 2)
                functionTree.removeListener('error', throwErrorCallback)
            else
                throw error
        })

    } else {
        functionTree.on('error', function throwErrorCallback(error) {
            if (Array.isArray(functionTree._events.error) && functionTree._events.error.length > 1)
                functionTree.removeListener('error', throwErrorCallback)
            else
                throw error
        })
    }

    // add root module
    store.module.set('.', init)

    changes.commit()
    functionTree.emit('initialized')

	return store
}



export default Store
