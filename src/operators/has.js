import curry from "../curry"

export default curry(function has(key, target) {
    return target && key in target
})
