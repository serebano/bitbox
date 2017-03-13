import { FunctionTree, sequence } from 'function-tree'

function Run(store) {
    const functionTree = new FunctionTree(store.providers.get())

    store.changes.on('providers', function UpdateProviders(changes) {
        const newProviders = store.providers.get()
        functionTree.contextProviders = newProviders
    })

    functionTree.runAction = function(action, props) {
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

    functionTree.on('asyncFunction', (e, action) => !action.isParallel && store.changes.commit())
    functionTree.on('parallelStart', () => store.changes.commit())
    functionTree.on('parallelProgress', (e, payload, resolving) => resolving === 1 && store.changes.commit())
    functionTree.on('end', () => store.changes.commit())

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

export default Run
