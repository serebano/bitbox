import box from "../box"

export default box(function proxy(handler, target) {
    return new Proxy(target, handler)
})
