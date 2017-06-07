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
const _toString = (_displayName, _receivedNames) => `function ${_displayName}(${_receivedNames.join(", ")}) {...}`
const getReceivedNames = (_argNames, received) =>
    _argNames.filter((arg, idx) => is.placeholder(received[idx]) || idx >= received.length)

function curryN(length, received, fn) {
    const _name = fn._name || fn.name
    const _argNames = fn._argNames || getArgNames(fn)

    //const _receivedNames = getReceivedNames(_argNames, received)
    //const _displayName = toDisplayName(_name, _argNames, received)

    N.toString = () => _toString(toDisplayName(_name, _argNames, received), getReceivedNames(_argNames, received))
    //N["@@functional/placeholder"] = true
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
                // if (is.placeholder(received[combinedIdx]) && is.func(received[combinedIdx])) {
                //     const $arg = received[combinedIdx]
                //     if ($arg.key) {
                //         _argNames[combinedIdx] = $arg.key
                //     }
                //     result = $arg(arguments[argsIdx], combinedIdx, combined, fn)
                // } else {
                //     result = arguments[argsIdx]
                // }
                //
                //

                if (is.placeholder(received[combinedIdx])) {
                    const $arg = received[combinedIdx]
                    //console.log(`arg`, _argNames, $arg.key, received, combined)

                    if ($arg.displayName) {
                        //_argNames[combinedIdx] = $arg.displayName
                        //console.log(`arg.displayName`, _argNames, $arg.displayName, combined)
                    }
                    if (is.func($arg)) {
                        result = $arg(arguments[argsIdx])
                        // , combinedIdx, combined, fn, {
                        //     name: _argNames[combinedIdx],
                        //     index: combinedIdx,
                        //     received
                        // })
                    } else {
                        result = arguments[argsIdx]
                    }
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
        //const _receivedNames = getReceivedNames(_argNames, combined)
        //const _displayName = toDisplayName(_name, _argNames, combined)

        //fx.toString = () => _toString(_displayName, _receivedNames)
        fx.toString = () => _toString(toDisplayName(_name, _argNames, combined), getReceivedNames(_argNames, combined))
        //fx["@@functional/placeholder"] = true

        return fx // desc(fn, fx, combined, length, left)
    }

    return N //desc(fn, N, received, length)
}

export default curryN
