import is from "./is"
import arity from "./arity"

import { getArgNames } from "./utils"

export const _curry0 = (fn, nextFn) => {
    function curried(...args) {
        if (args.length === 0 || (args.length === 1 && is.placeholder(args[0]))) {
            return curried
        }
        return nextFn(...args)
    }

    if (!fn.argNames) fn.argNames = getArgNames(fn)
    const argNames = fn.argNames

    curried["[[TargetFunction]]"] = fn
    curried["[[ArgumentNames]]"] = argNames

    curried.target = fn
    curried.argNames = argNames
    curried.displayName = "$" + (fn.displayName || fn.name)
    //curried.toString = () => `${curried.displayName}(${argNames}) => ${fn.displayName || fn.name}(${argNames})`

    return curried
}

export function curryN(n, fn) {
    if (n === 1) return fn

    return _curry0(fn, (...args) => {
        const argsLength = args.filter(arg => !is.placeholder(arg)).length
        fn.args = args

        if (argsLength >= n) {
            return fn(...args)
        }

        const restLength = n - argsLength

        return curryN(
            restLength,
            _curry0(fn, (...rest) => {
                fn.rest = rest
                return fn(...args.map(arg => (is.placeholder(arg) ? arg(rest.shift()) : arg)).concat(rest))
            })
        )
    })
}

export function cx(fn, ...args) {
    if (args.length >= fn.length) {
        return fn(...args)
    }

    return (...next) => cx(fn, ...args, ...next)
}

export default function curry(fn, length) {
    return curryN(length || fn.length, fn)
}
