import curry from "../curry"

export default curry(function sortWith(fns, list) {
    return Array.prototype.slice.call(list, 0).sort(function(a, b) {
        let result = 0
        let i = 0
        while (result === 0 && i < fns.length) {
            result = fns[i](a, b)
            i += 1
        }
        return result
    })
})
