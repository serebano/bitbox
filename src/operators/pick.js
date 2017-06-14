import curry from "../curry"

export default curry(function pick(names, obj) {
    var result = {}
    var idx = 0
    while (idx < names.length) {
        if (names[idx] in obj) {
            result[names[idx]] = obj[names[idx]]
        }
        idx += 1
    }
    return result
})
