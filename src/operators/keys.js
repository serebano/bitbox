import curry from "../curry"

export default curry(function keys(target) {
    return Object.keys(target)
})
