import curry from "../curry"

export default curry(function props(ps, obj) {
    var len = ps.length
    var out = []
    var idx = 0

    while (idx < len) {
        out[idx] = obj[ps[idx]]
        idx += 1
    }

    return out
})
