import curry from "../curry"

export default curry(function assoc(key, value, target) {
    const object = {}
    for (const k in target) {
        object[k] = target[k]
    }
    object[key] = value

    return object
})
