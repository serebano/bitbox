import curry1 from "./internal/curry1"
import curry2 from "./internal/curry2"
import curryTo from "./curry.to"
import desc from "./internal/desc"

function adaptTo(length, fn) {
    const f = curryTo(length, function(context) {
        return fn.apply(this, Array.prototype.slice.call(arguments, 1).concat(context))
    })

    return desc(fn, f, length)
}

export default curry1(function adapt(fn) {
    return adaptTo(fn.length, fn)
})
