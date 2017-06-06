import curry1 from "./internal/curry1"
import curry2 from "./internal/curry2"
import curryTo from "./curry.to"
import adapt from "./curry.adapt"
import { store } from "./internal/desc"

const curry = curry1(function curry(fn) {
    return curryTo(fn.length, fn)
})

curry.to = curryTo
curry.adapt = adapt
curry.store = store

export default curry
