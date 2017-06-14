import is from "../is"
import curry from "../curry"

function path(keys, getter, target) {
    if (!keys.length) return getter(undefined, target)
    return keys.reduce((obj, key, index) => {
        if (is.array(key)) key = path(key, getter, target)
        if (is.func(key)) return key(obj)
        if (index === keys.length - 1) return getter(key, obj)

        return obj[key]
    }, target)
}

export default curry(path)

// box(path(__, set(__, inc, __), obj)).count()
// > incx = path(__, set(__, inc, __), obj)
// < (path) => getByPath(path, getter:(key, target) => set(key, value:(b) => add(a:1, b), target), target:[object Object])
// box((p, a) => path(p, apply(pipe, a))).count(set(__, add(100)), tag`count = ${0}`)(obj)
