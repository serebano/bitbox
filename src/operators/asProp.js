import _curry3 from "../internal/curry3"

export default _curry3(function asProp(key, asKey, target) {
    return { [asKey]: target[key] }
})
