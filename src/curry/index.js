import curry1 from "./curry.1"
import curry2 from "./curry.2"
import curry3 from "./curry.3"
import curryTo from "./curry.to"
import curryX from "./curry.x"
import adapt from "./curry.adapt"
import { store } from "./desc"

const curry = curry1(function curry(fn) {
    return curryTo(fn.length, fn)
})

curry.f1 = curry1
curry.f2 = curry2
curry.f3 = curry3
curry.x = curryX
curry.to = curryTo
curry.adapt = adapt
curry.store = store

export default curry
