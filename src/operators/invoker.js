import { curryN } from "../curry"

export default curryN(2, function invoker(arity, method) {
    return curryN(arity + 1, function() {
        const target = arguments[arguments.length - 1]
        const args = Array.prototype.slice.call(arguments, 0, -1)
        return target[method].apply(target, args)
    })
})
