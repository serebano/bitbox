import curry from "../curry"
import assocPath from "./assocPath"

export default curry(function assoc(key, value, target) {
    if (Array.isArray(key)) return assocPath(key, value, target)

    const object = {}
    for (const k in target) {
        object[k] = target[k]
    }
    object[key] = value

    return object
})
