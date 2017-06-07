import create from "./create"
import curry1 from "./curry.1"
import curry2 from "./curry.2"
import curryN from "./curry.n"

export default curry2(function curryTo(length, fn) {
    if (length === 1) return curry1(fn)

    return create(length, curryN(length, [], fn))
})