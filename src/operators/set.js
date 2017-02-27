export default function set(target, value) {
    function set(context) {
        return context.set(target, value)
    }

    set.toString = () => `set(${target}, ${value})`

    return set
}
