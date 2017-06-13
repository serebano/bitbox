import curry from "../curry"

export default curry(function flip(fn) {
    return curry(function(a, b) {
        var args = Array.prototype.slice.call(arguments, 0)
        args[0] = b
        args[1] = a
        return fn.apply(this, args)
    })
})
