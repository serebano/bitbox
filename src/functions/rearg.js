import curry from "./curry"
import arity from "./arity"

export default curry(function rearg(newOrder, fn) {
    const length = newOrder.length
    return arity(length, function() {
        const args = []
        for (var i = 0; i < length; ++i) {
            args[newOrder[i]] = arguments[i]
        }
        return fn.apply(this, args)
    })
})

//export const flip = rearg([1, 0])
