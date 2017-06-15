import curry from "../curry"
import _isFunction from "../curry/isFunction"
import toString from "./toString"

export default curry(function invoke(a, method) {
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
        if (target != null && _isFunction(target[method])) {
            return target[method].apply(target, Array.prototype.slice.call(arguments, 0, length))
        }
        throw new TypeError(toString(target) + ' does not have a method named "' + method + '"')
    }

    invoker.displayName = method

    return curry.to(length + 1, invoker, argNames)
})
