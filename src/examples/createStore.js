import bitbox from "../bitbox"
import FunctionTree, { sequence, parallel } from "function-tree"
export { sequence, parallel, FunctionTree }

function argsProvider(context, action, { args = [] }) {
    context[Symbol.for("args")] = args
    context.props = args[0] || {}

    return context
}

function createStore(store) {
    const state = bitbox.observable(store.state)

    const functionTree = new FunctionTree([argsProvider, { state }])

    const signals = Object.keys(store.signals || {}).reduce((obj, key) => {
        obj[key] = (...args) => functionTree.run(key, store.signals[key], { args })
        return obj
    }, {})

    return {
        state,
        signals,
        functionTree
    }
}

export default createStore
