import { queue, state } from "./observer/store"

function run(target, fn, ...args) {
    const action = {
        keys: [],
        paths: [],
        changes: []
    }

    try {
        state.currentObserver = action
        action.result = fn.apply(target, args)
    } finally {
        delete state.currentObserver
    }

    action.keys.forEach(actions => actions.delete(action))
    queue.delete(action)
    delete action.keys

    return action
}

export default run

export function action(fn) {
    function runAction(...args) {
        const result = run(this, fn, ...args)

        console.log(result.changes.map(p => p.join(".")))

        return result
    }

    runAction.toString = () => `function ${fn.name}() { [Action API] }`

    return runAction
}
