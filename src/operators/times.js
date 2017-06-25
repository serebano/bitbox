import curry from "../curry"

export default curry(function times(fn, n) {
    var len = Number(n)
    var idx = 0
    var list

    if (len < 0 || isNaN(len)) {
        throw new RangeError("n must be a non-negative number")
    }
    list = new Array(len)

    while (idx < len) {
        list[idx] = fn(idx)
        idx += 1
    }

    return list
})
