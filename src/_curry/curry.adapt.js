import curry1 from "./curry.1"
import curry2 from "./curry.2"
import curryTo from "./curry.to"
import desc from "./desc"

export const adaptTo = curry2(function(length, fn) {
    const f = curryTo(length, function adaptTo(context) {
        return fn.apply(this, Array.prototype.slice.call(arguments, 1).concat(context))
    })

    return desc(fn, f, [], length)
})

const adapt = curry1(function adapt(fn) {
    return adaptTo(fn.length, fn)
})

adapt.to = adaptTo

export default adapt
