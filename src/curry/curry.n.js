import create from "./create"
import is from "../is"

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

export default curryX
