import is from "./is"
import curry from "./curry"
import arity from "./arity"
import { defaultTo } from "./functions"
/**
    __(fn, ...args) ->
    arg => fn(arg, ...args)
    const $ = curry(arg => (is.placeholder(arg) ? __(fn(arg, ...args)) : fn(arg, ...args)))
*/

function argFn(fn, args) {
    const fx = arg => {
        const res = is.placeholder(arg) ? argFn(fn(arg, args)) : fn(arg, ...args)
        console.log(`arg`, { fn, arg, args, res })
        return res
    }
    console.log(`argFn`, { fn, args, fx })

    fx["@@functional/placeholder"] = true
    return fx
}

function __(fn, ...args) {
    return argFn(fn, args)
}

__["@@functional/placeholder"] = true

export default __
