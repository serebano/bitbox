import { getArgNames, toCamelCase, toDisplayName } from "../utils"
import desc, { pairArgs } from "./desc"
import is from "../is"
import create from "./create"

function curry(fn) {
    return curryX(fn, fn.length, [], getArgNames(fn), [])
}

curry.to = curryTo

function curryTo(length, fn) {
    return curryX(fn, length, [], getArgNames(fn), [])
}

function curryX(fn, length, received, argNames, receivedIdxMap) {
    //console.log(`curryX`, length, left, received, argNames, idxMap)
    next.receivedNames = receivedIdxMap.map((_, idx) => argNames[idx])
    next.expectedNames = argNames.filter((name, idx) => !next.receivedNames.includes(name))
    //next.idxMap = [next.receivedNames, next.expectedNames]
    next.received = received

    function next() {
        //console.log(`next/arguments`, arguments)
        let idx = 0
        let args = []
        let argsIdx = 0
        let left = length
        let idxMap = []
        while (argsIdx < received.length || idx < arguments.length) {
            let result, idxres
            if (argsIdx < received.length && (!is.placeholder(received[argsIdx]) || idx >= arguments.length)) {
                result = received[argsIdx]
                idxres = receivedIdxMap[argsIdx]
                //if (!is.placeholder(result)) idxMap[argsIdx] = argsIdx
            } else {
                const $arg = received[argsIdx]
                if (is.placeholder($arg)) {
                    if (is.func($arg) && $arg.isHandler) {
                        result = $arg(arguments[idx])
                    } else {
                        result = arguments[idx]
                    }
                } else {
                    result = arguments[idx]
                    idxres = idx
                }
                idx += 1
            }

            args[argsIdx] = result
            if (!is.placeholder(result)) {
                idxMap[argsIdx] = idxres
                left -= 1
            }
            argsIdx += 1
        }

        if (left <= 0) {
            return fn.apply(this, args)
        }

        return curryX(fn, length, args, argNames, idxMap)
    }

    const fx = desc(fn, next, received, argNames, receivedIdxMap)
    //console.warn(`fx`, fx.receivedNames, fx.expectedNames, received, { fx })

    return fx
}

export default curry
