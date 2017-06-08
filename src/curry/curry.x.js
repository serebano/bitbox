import { getArgNames, toCamelCase, toDisplayName } from "../utils"
import desc, { pairArgs } from "./desc"
import is from "../is"
import create from "./create"

function curry(fn, argNames) {
    const length = fn.length
    return curryX(fn, length, [], argNames || getArgNames(fn), [], length)
}

curry.to = curryTo

function curryTo(length, fn, argNames) {
    return curryX(fn, length, [], argNames || getArgNames(fn), [], length)
}

function curryX(fn, length, received, argNames, receivedNames, left) {
    //console.log(`curryX`, length, left, received, argNames, idxMap)
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
                //idxres = argNames[argsIdx]
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
                    //idxres = argNames[idx]
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

        return curryX(fn, length, args, argNames, idxMap, left)
    }
    const fx = create(left, next)
    fx.receivedNames = receivedNames //receivedIdxMap.map((_, idx) => argNames[idx])
    fx.expectedNames = argNames.filter((name, idx) => is.placeholder(received[idx]) || !receivedNames.includes(name))
    //next.received = received

    desc(fn, fx, received, argNames, receivedNames)
    //console.warn(`fx`, fx.receivedNames, fx.expectedNames, received, { fx })

    return fx
}

export default curry
