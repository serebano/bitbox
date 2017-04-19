import FunctionTree, { sequence, parallel } from "function-tree"
export { sequence, parallel, FunctionTree }

function argsProvider(context, action, props) {
    const args = props.args || []
    context.props = args[0] || {}
    context[Symbol.for("args")] = args

    return context
}

export default function(...providers) {
    const funtree = new FunctionTree([argsProvider, ...providers])

    return function createSignal(name, tree) {
        function signal(...args) {
            return funtree.run(name, tree, { args })
        }

        signal.displayName = `signal("${name}", ${tree.displayName || tree})`

        return signal
    }
}
