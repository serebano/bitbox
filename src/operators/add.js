import curry from "../curry"

export default curry(function add(a, b) {
    return Number(a) + Number(b)
})
