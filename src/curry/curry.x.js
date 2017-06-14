import { getArgNames, toCamelCase, toDisplayName } from "../utils"
import desc, { pairArgs } from "./desc"
import is from "../is"
import create from "./create"
import curry1 from "./curry.1"
import isCurryable from "./isCurryable"
import __ from "./arg"

function curry(fn, argNames) {
    if (isCurryable(fn)) {
        return curryTo(argNames.length, fn, argNames)
    }
    if (arguments.length === 2) {
        return curryTo(argNames.length, fn, argNames)
    }
    return curryTo(fn.length, fn, argNames)
}
// curry(set, ['value','key','target'])
function fn(...args) {
    const f = Function(...args)
    return curryTo(f.length, f)
}
curry.fn = fn
function f(fn, ...args) {
    return curryTo(
        args.length,
        function $() {
            const map = args.reduce((obj, key, idx) => {
                obj[key] = arguments[idx]
                return obj
            }, {})
            console.log(`map`, map)
            return fn(...args.map((arg, idx) => arguments[idx]))
        },
        args
    )
}
curry.f = f

function curryTo(length, fn, argNames) {
    argNames = argNames || getArgNames(fn)
    const nextFn = curryX(fn, length, [], argNames, [], length)
    return create(length, nextFn, fn, [], argNames)
}

function curryMap(fn, ...m) {
    if (m.length < fn.length) {
        fn.argNames.forEach((a, i) => {
            if (m.indexOf(i) === -1) {
                m.push(i)
            }
        })
    }
    const argNames = m.map(i => fn.argNames[i])
    function argMap() {
        return fn.apply(this, m.map(i => arguments[i]))
    }
    argMap.displayName = fn.displayName
    return curryTo(m.length, argMap, argNames)
}
curry.map = create.map = curryMap
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
    function next() {
        if (arguments.length === 0) return next.fn

        let idx = 0
        let args = []
        let argsIdx = 0
        let left = length
        let idxMap = []
        let argsMap = []

        while (argsIdx < received.length || idx < arguments.length) {
            let result, idxres

            if (argsIdx < received.length && (!is.placeholder(received[argsIdx]) || idx >= arguments.length)) {
                result = received[argsIdx]
            } else {
                const $arg = received[argsIdx]
                const val = arguments[idx]
                if (is.placeholder($arg)) {
                    if ($arg["@@isHandler"]) {
                        result = $arg(val)
                    } else {
                        result = val
                    }
                } else {
                    result = val
                }
                idx += 1
            }

            args[argsIdx] = result
            idxMap.push(argNames[argsIdx] || argsIdx)
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

    return next
}

export default curry
