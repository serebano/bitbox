import is from "./is"
import curry from "./curry"
import defaultTo from "./operators/defaultTo"

export const placeholder = Symbol.for("functional/placeholder")

function __(fn, ...args) {
    if (!is.func(fn)) fn = defaultTo(fn)

    const fx = arg => (is.placeholder(arg) ? __(fn(arg, ...args)) : fn(arg, ...args))

    fx.toString = () => `__(${fn})`
    fx[placeholder] = true

    return fx
}

__.toString = () => `__`
__[placeholder] = true

export default __
