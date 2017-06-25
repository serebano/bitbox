import curry from "../curry"
import type from "./type"

export default curry(function invoker(arity, method) {
    if (type(arity) === "Function") return invoker(arity.length, method)

    function invoke() {
        const target = arguments[arguments.length - 1]
        const args = Array.prototype.slice.call(arguments, 0, -1)

        return target[method].apply(target, args)
    }

    invoke.displayName = method

    return curry(invoke, arity + 1)
})
