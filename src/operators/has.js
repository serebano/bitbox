import curry from "../curry"

export default curry(function has(key, target) {
    return Object.prototype.hasOwnProperty.call(target, key)
})
