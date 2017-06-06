import curry from "../curry"

export default curry(function get(key, target) {
    return target[key]
})
