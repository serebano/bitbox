import curry from "../curry"
import type from "./type"

export default curry(function methods(obj) {
    const ret = {}
    const keys = Object.getOwnPropertyNames(obj)
    for (var i = 0; i < keys.length; ++i) {
        const key = keys[i]
        if (type(obj[key]) === "Function") {
            ret[key] = obj[key]
        }
    }
    return ret
})
