import { getArgNames, toCamelCase, toDisplayName } from "../utils"
import is from "../is"
import create from "./create"
import curry1 from "./curry.1"
import isCurryable from "./isCurryable"
import __ from "./arg"

function curry(fn, argNames) {
    // if (isCurryable(fn)) {
    //     let args = Array.prototype.slice.call(arguments, 1)
    //     return args && args.length ? curry.map(fn, ...args) : fn
    //     //return curryTo(fn.length, fn, argNames)
    // }
    return curryTo(fn.length, fn, argNames)
}

curry.fn = function fn(...args) {
    const f = Function(...args)
    return curryTo(f.length, f)
}

curry.map = curry(function map(fn) {
    const argNames = fn.argNames || getArgNames(fn)
    const args = Array.prototype.slice.call(arguments, 1).map(a => (is.integer(a) ? a : argNames.indexOf(a)))
    let ids = []
    let n = 0
    while (n < fn.length) {
        ids[n] = args.length > n ? args[n] : n
        ///ids.push(n)
        n += 1
    }
    let xid = 0
    let an = []
    const argx = argNames.map((name, idx) => {
        const midx = args.indexOf(idx)
        if (midx > -1) {
            //ids.splice(midx, 1)
            an.push(name)
            return [midx, name, argNames[midx]]
        }
        xid++
        const _pidx = argNames.length - xid //ids.pop()
        return [_pidx, name, argNames[_pidx]]
    })

    //const argn = argx.map(idx => argNames[idx])

    console.log(`args`, ids, ...argx)

    function fx() {
        const result = argx.map(i => arguments[i[0]])
        console.log(`a`, ...result)
        return fn.apply(this, result)
    }

    fx.displayName = fn.displayName
    fx.toString = (...a) =>
        `(${argx.map(a => a[2]).join(", ")}) => ` + fn.displayName + "(" + argx.map(a => a[1]).join(", ") + ")" //toString(...args)

    return curryTo(fn.length || args.length, fx)
})

function curryTo(length, fn, argNames) {
    argNames = argNames || getArgNames(fn)
    const nextFn = curryX(fn, length, [], argNames, [], length)
    return create(length, nextFn, fn, [], argNames)
}

curry.to = curryTo

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
