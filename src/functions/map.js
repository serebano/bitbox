import curry from "./curry"
import type from "./type"

export function mapObj(fn, functor) {
    return Object.keys(functor).reduce((acc, key) => {
        acc[key] = fn(functor[key], key)
        return acc
    }, {})
}

export function mapArr(fn, functor) {
    let idx = 0
    let len = functor.length
    let result = Array(len)

    while (idx < len) {
        result[idx] = fn(functor[idx])
        idx += 1
    }

    return result
}

export default curry(function map(fn, functor) {
    return type(functor) === "Object" ? mapObj(fn, functor) : mapArr(fn, functor)
})
