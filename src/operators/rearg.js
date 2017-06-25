import curry from "../curry"
import reorder from "./reorder"

export default curry(function rearg(order, fn) {
    function fx() {
        return fn.apply(this, reorder(order, arguments))
    }
    fx.displayName = fn.displayName
    fx.argNames = reorder(order, fn.argNames) //order.map(o => fn.argNames[o])
    return curry(fx, order.length)
})

// curry(function rearg(newOrder, fn) {
//     const length = newOrder.length
//     return arity(length, function() {
//         const args = [] //Array.prototype.slice.call(arguments, 0)
//         for (var i = 0; i < length; ++i) {
//             args[newOrder[i]] = arguments[i]
//         }
//         return fn.apply(this, args)
//     })
// })

//export const flip = rearg([1, 0])
