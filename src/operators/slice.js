import curry from "../curry"

export default curry(function slice(fromIndex, toIndex, list) {
    return Array.prototype.slice.call(list, fromIndex, toIndex)
})
