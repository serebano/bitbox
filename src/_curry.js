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

export function _curryN(n, fn) {
    if (n === 1) return fn

    return _curry0(fn, (...args) => {
        const argsLength = args.filter(arg => !is.placeholder(arg)).length
        fn.args = args

        if (argsLength >= n) {
            return fn(...args)
        }

        const restLength = n - argsLength

        return _curryN(
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

export function curryN(length, fn) {
    return arity(length, function() {
        let n = arguments.length
        let shortfall = length - n
        let idx = n
        while (--idx >= 0) {
            if (is.placeholder(arguments[idx])) {
                shortfall += 1
            }
        }
        if (shortfall <= 0) {
            return fn.apply(this, arguments)
        } else {
            let initialArgs = [...arguments]
            return curryN(shortfall, function() {
                const currentArgs = [...arguments]
                const combinedArgs = []
                let idx = -1
                while (++idx < n) {
                    var val = initialArgs[idx]
                    combinedArgs[idx] = is.placeholder(val) ? val(currentArgs.shift()) : val
                }
                return fn.apply(this, combinedArgs.concat(currentArgs))
            })
        }
    })
}

export default function curry(fn) {
    return curryN(fn.length, fn)
}
