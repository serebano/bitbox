import curry from "./curry"
import curryN from "./curryN"
import type from "./type"

export default curry(function invoker(arity, method) {
    if (type(arity) === "Function") return invoker(arity.length, method)
    const m = arguments[2]
    return curryN(arity + 1, function() {
        const target = m ? m(arguments[arguments.length - 1]) : arguments[arguments.length - 1]
        const args = Array.prototype.slice.call(arguments, 0, -1)

        return target[method].apply(target, args)
    })
})
