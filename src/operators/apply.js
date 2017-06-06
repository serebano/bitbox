import curry from "../curry"

export default curry(function apply(fn, args) {
    return fn.apply(this, args)
})
