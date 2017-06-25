import curry from "../curry"

export default curry(function max(a, b) {
    return b > a ? b : a
})
