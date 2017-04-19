export default function Signal(tree) {
    function signal(...args) {
        return Signal.run(tree, { args })
    }

    signal.displayName = `signal(${tree})`

    return signal
}
