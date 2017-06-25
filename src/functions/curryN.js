import is from "./is"
import arity from "./arity"
import __ from "./__"

function curryN(length, fn) {
    return arity(length, function() {
        let n = arguments.length
        let shortfall = length - n
        let idx = n
        while (--idx >= 0) {
            if (is.placeholder(arguments[idx])) shortfall += 1
        }

        if (shortfall <= 0) {
            return fn.apply(this, arguments)
        } else {
            const initialArgs = [...arguments]

            return curryN(shortfall, (...currentArgs) => {
                let combinedArgs = []
                let idx = -1
                while (++idx < n) {
                    const val = initialArgs[idx]
                    combinedArgs[idx] = is.placeholder(val)
                        ? val !== __ ? val(currentArgs.shift()) : currentArgs.shift()
                        : val
                }
                return fn.apply(this, combinedArgs.concat(currentArgs))
            })
        }
    })
}

export default curryN
