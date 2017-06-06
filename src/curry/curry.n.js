import create from "./create"
import desc from "./desc"
import is from "../is"
import { getArgNames, toCamelCase, toDisplayName } from "../utils"

const _pairArgs = (_argNames, received) =>
    received.reduce((obj, value, idx) => {
        const key = !is.undefined(_argNames[idx]) ? _argNames[idx] : idx
        obj[key] = value
        return obj
    }, {})
const _toString = (_displayName, _receivedNames) => () => `function ${_displayName}(${_receivedNames.join(", ")}) {...}`
const getReceivedNames = (_argNames, received) =>
    _argNames.filter((arg, idx) => is.placeholder(received[idx]) || idx >= received.length)

function curryN(length, received, fn) {
    const _name = fn._name || fn.name
    const _argNames = fn._argNames || getArgNames(fn)

    const _receivedNames = getReceivedNames(_argNames, received)
    const _displayName = toDisplayName(_name, _argNames, received)

    N.toString = _toString(_displayName, _receivedNames)

    function N() {
        let combined = []
        let argsIdx = 0
        let left = length
        let combinedIdx = 0

        while (combinedIdx < received.length || argsIdx < arguments.length) {
            let result
            if (
                combinedIdx < received.length &&
                (!is.placeholder(received[combinedIdx]) || argsIdx >= arguments.length)
            ) {
                result = received[combinedIdx]
            } else {
                if (is.placeholder(received[combinedIdx]) && is.func(received[combinedIdx])) {
                    result = received[combinedIdx](arguments[argsIdx], combinedIdx, combined)
                } else {
                    result = arguments[argsIdx]
                }
                argsIdx += 1
            }
            combined[combinedIdx] = result
            if (!is.placeholder(result)) left -= 1
            combinedIdx += 1
        }

        if (left <= 0) return fn.apply(this, combined)

        const fx = create(left, curryN(length, combined, fn))
        const _receivedNames = getReceivedNames(_argNames, combined)
        const _displayName = toDisplayName(_name, _argNames, combined)

        fx.toString = _toString(_displayName, _receivedNames)

        return fx // desc(fn, fx, combined, length, left)
    }

    return N //desc(fn, N, received, length)
}

export default curryN
