import curryTo from "./to"
import curryFn from "./fn"

curry.to = curryTo
curry.fn = curryFn

function curry(fn, argNames) {
    // if (isCurryable(fn)) {
    //     let args = Array.prototype.slice.call(arguments, 1)
    //     return args && args.length ? curry.map(fn, ...args) : fn
    //     //return curryTo(fn.length, fn, argNames)
    // }
    return curryTo(fn.length, fn, argNames)
}

export default curry
