import { getArgNames, toCamelCase, toDisplayName } from "../utils"
import desc, { pairArgs } from "./desc"
import is from "../is"
import create from "./create"
import curry1 from "./curry.1"

function curry(fn, argNames) {
    return curryTo(fn.length, fn, argNames)
}

function curryTo(length, fn, argNames) {
    argNames = argNames || getArgNames(fn)

    if (length === 1) {
        return curry1(fn, argNames)
    }
    const nextFn = curryX(fn, length, [], argNames, [], length)
    return create(length, nextFn, fn, [], argNames)
}

export const adaptTo = curry(function(length, fn) {
    return curryTo(length, function adaptTo(target) {
        return fn.apply(this, Array.prototype.slice.call(arguments, 1).concat(target))
    })
})

export const adapt = curry(function adapt(fn) {
    return adaptTo(fn.length, fn)
})

curry.to = curryTo
curry.adapt = adapt
curry.adaptTo = adaptTo

function curryX(fn, length, received, argNames, receivedNames, left) {
    //console.log(`curryX`, fn.name, length, left, received, argNames, receivedNames)

    function next() {
        if (arguments.length === 0) return next

        let idx = 0
        let args = []
        let argsIdx = 0
        let left = length
        let idxMap = []

        while (argsIdx < received.length || idx < arguments.length) {
            let result, idxres

            if (argsIdx < received.length && (!is.placeholder(received[argsIdx]) || idx >= arguments.length)) {
                result = received[argsIdx]
            } else {
                const $arg = received[argsIdx]
                if (is.placeholder($arg)) {
                    if (is.func($arg) && $arg["@@isHandler"]) {
                        result = $arg(arguments[idx])
                    } else {
                        result = arguments[idx]
                    }
                } else {
                    result = arguments[idx]
                }
                idx += 1
            }

            args[argsIdx] = result
            idxMap[argsIdx] = argNames[argsIdx]
            if (!is.placeholder(result)) {
                left -= 1
            }
            argsIdx += 1
        }

        if (left <= 0) {
            return fn.apply(this, args)
        }

        const nextFn = curryX(fn, length, args, argNames, idxMap, left)

        return create(left, nextFn, fn, args, argNames, idxMap)
    }

    //next.receivedNames = receivedNames
    //next.expectedNames = argNames.filter((name, idx) => is.placeholder(received[idx]) || !receivedNames.includes(name))

    //desc(fn, next, received, argNames, receivedNames)

    return next
}

export default curry
