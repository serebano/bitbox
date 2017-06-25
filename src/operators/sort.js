import curry from "../curry"

export default curry(function sort(comparator, list) {
    return Array.prototype.slice.call(list, 0).sort(comparator)
})
