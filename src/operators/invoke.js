import curry from "../curry"
import toString from "./toString"
import is from "../is"

export default curry(function invoke(method, a) {
    let length, argNames
    if (Array.isArray(a)) {
        argNames = a
        length = a.length - 1
    } else {
        length = a
        argNames = Array(length + 1).fill("arg").map((_, i) => `a${i}`)
    }

    function invoker() {
        const target = arguments[length]
        if (target != null && is.func(target[method])) {
            return target[method].apply(target, Array.prototype.slice.call(arguments, 0, length))
        }
        throw new TypeError(toString(target) + ' does not have a method named "' + method + '"')
    }

    invoker.displayName = method

    return curry(invoker, length + 1, argNames)
})
