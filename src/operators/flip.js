import rearg from "./rearg"

export default rearg([1, 0])

// curry(function flip(fn) {
//     function f(a, b) {
//         const args = Array.prototype.slice.call(arguments, 0)
//         args[0] = b
//         args[1] = a
//         return fn.apply(this, args)
//     }
//     f.displayName = fn.displayName
//     return curry(f, fn.length)
// })
