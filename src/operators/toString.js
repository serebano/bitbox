import _curry1 from "../internal/curry1"
import _toString from "../internal/toString"

export default _curry1(function toString(val) {
    return _toString(val, [])
})
