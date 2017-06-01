import _curry2 from "../internal/curry2"

export default _curry2(function prop(key, target) {
    return target[key]
})
