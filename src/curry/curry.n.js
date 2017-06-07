import create from "./create"
import desc from "./desc"
import is from "../is"

function curryN(length, received, fn) {
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
                if (is.placeholder(received[combinedIdx])) {
                    const $arg = received[combinedIdx]
                    if (is.func($arg)) {
                        result = $arg(arguments[argsIdx])
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
        return desc(fn, fx, combined)
    }

    return desc(fn, N, received)
}

export default curryN
