import curry from "../curry"

export default curry(function tail(arg) {
    return Array.prototype.slice.call(arg, 1)
})
