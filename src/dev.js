import curry from "./curry"
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

export function cx(fn, ...args) {
    if (args.length >= fn.length) {
        return fn(...args)
    }

    return (...next) => cx(fn, ...args, ...next)
}

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
