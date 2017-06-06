import _arity from "./internal/arity"
import _curry1 from "./internal/curry1"
import _curry2 from "./internal/curry2"
import _curryN from "./internal/curryN"

export default _curry2(function curryTo(length, fn) {
    if (length === 1) return _curry1(fn)

    return _arity(length, _curryN(length, [], fn))
})
