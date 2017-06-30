import is from "./is"
import curry from "./curry"
import defaultTo from "./operators/defaultTo"

export const placeholder = Symbol.for("functional/placeholder")
export const isPlaceholder = arg => typeof arg === "function" && Reflect.has(arg, placeholder)

function __(fn, ...args) {
    const fx = curry(function __arg(arg) {
        if (!is.func(fn)) fn = defaultTo(fn)
        return isPlaceholder(arg) ? __(fn(arg, ...args)) : fn(arg, ...args)
    })

    fx.toString = () => `__(${fn})`
    fx[placeholder] = true

    return fx
}

__.toString = () => `__`
__[placeholder] = true

export default __
