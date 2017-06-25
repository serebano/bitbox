import curry from "../curry"

export default curry(function proxy(handler, target) {
    return new Proxy(target, handler)
})
