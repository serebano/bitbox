import curry from "../curry"

export default curry(function call(fn) {
    return fn.apply(this, Array.prototype.slice.call(arguments, 1))
})
