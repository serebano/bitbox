import is from "./is"
import curryN from "./curryN"
const placeholder = Symbol.for("functional/placeholder")

function __(fn, ...args) {
    const fx = curryN(1, arg => (arg[placeholder] === true ? __(fn(arg, ...args)) : fn(arg, ...args)))
    fx[placeholder] = true
    return fx
}

__[placeholder] = true

export default __
