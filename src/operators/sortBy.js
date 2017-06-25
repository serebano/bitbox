import curry from "../curry"

export default curry(function sortBy(fn, list) {
    return Array.prototype.slice.call(list, 0).sort(function(a, b) {
        const aa = fn(a)
        const bb = fn(b)
        return aa < bb ? -1 : aa > bb ? 1 : 0
    })
})
