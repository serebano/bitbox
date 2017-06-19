import is from "./is"
import curry from "./curry"
import __ from "./__"
const MAX_SAFE_INTEGER = 9007199254740991
const PLACEHOLDER = "__lodash_placeholder__"
/** Used to detect unsigned integer values. */
const reIsUint = /^(?:0|[1-9]\d*)$/

function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length
    return (
        !!length &&
        (typeof value == "number" || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length)
    )
}

export function reorder(array, indexes) {
    const oldArray = [...array]
    const arrLength = array.length
    let length = Math.min(indexes.length, arrLength)
    while (length--) {
        const index = indexes[length]
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined
    }
    return array
}
export function rearg(fn, indexes) {
    return (...args) => fn(...reorder(args, indexes))
}
export function cx(fn, ...args) {
    if (args.length >= fn.length) {
        return fn(...args)
    }

    const next = (...rest) => {
        const a = args.map(arg => (is.placeholder(arg) ? arg(rest.shift()) : arg)).concat(rest)
        return cx(fn, ...a)
    }
    next[`[[CurryFunction]]`] = fn
    next[`[[CurryArgs]]`] = args

    return next
}
export const _set = cx((key, val, obj) => (obj[key] = val(obj[key])))
_set(__(a => a), a => a + 1)("x", { x: 0 })

const f = cx(cx((a, b, c) => a + b * c))

console.log(f(1)(2)(3))

export function Demo(key, value, object) {
    return { key, value, object }
}

export function g(a, b, c) {
    return [a, b, c]
}

export function args(...args) {
    return args
}

export const x = curry(g)
