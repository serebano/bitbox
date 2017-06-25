import curry from "../curry"

export default curry(function defaultTo(value, target) {
    return target == null || target !== target ? value : target
})
