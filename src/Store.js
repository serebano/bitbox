import Tag from './Tag'
import Changes from './Changes'
import * as tags from './tags'
import {getProviders,createResolver} from './utils'
import ContextFactory from './Context'
import {FunctionTree,sequence} from 'function-tree'
import DebuggerProvider from './providers/debugger'
import {set} from './operators'
import Model from './Model'


function StoreProvider(store) {
    return function(context) {
        context.get = (target, transform) => target.get(store, transform)
        context.set = (target, value) => target.set(store, value)
        context.update = (target, ...args) => target.update(store, ...args)

        return context
    }
}

function Store(init = {}, ...providers) {

    const devtools = init.devtools
    const changes = new Changes({ devtools })
    const store = { changes, devtools }

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

    store.get = (target, props) => target.get(Context(props))
    store.path = (target, props) => target.path(Context(props))
    store.paths = (target, props) => target.paths(Context(props))
    store.connect = (target, func, props) => changes.connect(store.paths(target, props), func)

    store.commit = (force) => {
        if (!force && !Object.keys(changes.changes).length)
            return

        functionTree.emit('flush', changes.commit(force), Boolean(force))
    }

    if (devtools)
        providers.unshift(DebuggerProvider(store))

    const functionTree = new FunctionTree([
        StoreProvider(store),
        store.state.provider(),
        store.signal.provider(),
        ...providers.concat(store.module.providers())
    ])

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
