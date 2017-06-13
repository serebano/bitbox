import is from "../is"
import curry from "../curry"

function getByPath(path, getter, target) {
    if (!path.length) return getter(undefined, target)
    return path.reduce((obj, key, index, path) => {
        if (is.array(key)) key = getByPath(key, getter, target)
        if (index === path.length - 1) return getter.length === 2 ? getter(key, obj) : getter(obj[key])
        if (is.func(key)) return key(obj)

        return obj[key]
    }, target)
}

export default curry(getByPath)

// box(path(__, set(__, inc, __), obj)).count()
// > incx = path(__, set(__, inc, __), obj)
// < (path) => getByPath(path, getter:(key, target) => set(key, value:(b) => add(a:1, b), target), target:[object Object])
// box((p, a) => path(p, apply(pipe, a))).count(set(__, add(100)), tag`count = ${0}`)(obj)
