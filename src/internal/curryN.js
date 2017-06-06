import _arity from "./arity"
import _isPlaceholder from "./isPlaceholder"
import desc, { store } from "./desc"
import { getArgNames } from "../utils"

export default function _curryN(length, received, fn) {
    if (!store.has(fn)) {
        store.set(fn, new Set())
        fn.curried = []
    }
    fn.curried.push(fn)
    nFn.fn = fn
    nFn.displayName = fn.displayName || fn.name
    nFn.argsNames = getArgNames(fn)
    nFn.argsReceived = received
    nFn.argsLength = length
    nFn.argsMap = new Array(length).fill({})
    //nFn.toString = () => nFn.displayName + length + "( " + nFn.argsNames.join(", ") + " )"

    store.get(fn).add(nFn)

    function nFn() {
        let combined = []
        let argsIdx = 0
        let left = length
        let combinedIdx = 0

        while (combinedIdx < received.length || argsIdx < arguments.length) {
            var result
            if (
                combinedIdx < received.length &&
                (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)
            ) {
                result = received[combinedIdx]
            } else {
                result = arguments[argsIdx]
                argsIdx += 1
            }
            combined[combinedIdx] = result
            if (!nFn.argsMap[combinedIdx]) {
                nFn.argsMap[combinedIdx] = {
                    index: combinedIdx,
                    value: result,
                    name: nFn.argsNames[combinedIdx]
                }
            }
            //nFn.argsMap[combinedIdx].value = result

            if (!_isPlaceholder(result)) {
                left -= 1
            }
            combinedIdx += 1
        }

        if (left <= 0) return fn.apply(this, combined)

        return _arity(left, _curryN(length, combined, fn))
    }

    return nFn //desc(fn, nFn, length)
}
