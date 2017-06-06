import curry1 from "./curry.1"
import curry2 from "./curry.2"
import curryTo from "./curry.to"
import curryX from "./curry.x"
import adapt from "./curry.adapt"
import { store } from "./desc"

const curry = curry1(function curry(fn) {
    return curryTo(fn.length, fn)
})

curry.x = curryX
curry.to = curryTo
curry.adapt = adapt
curry.store = store

export default curry
