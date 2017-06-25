import curry from "../curry"

export default curry(function tap(fn, target) {
    fn(target)
    return target
})
