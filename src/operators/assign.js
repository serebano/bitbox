import curry from "../curry"

export default curry(function assign(object, target) {
    return Object.assign(target, object)
})
