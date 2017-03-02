export default (target, value = 1) => {

    function inc(target, key, value) {
        if (!(key in target))
            target[key] = 0

        target[key] =+ value
    }

    increment.operator = inc

    function increment({ update }) {
        update(target, value, inc)
    }

    increment.displayName = `increment(${String(target)}, ${String(value)})`

    return increment
}
