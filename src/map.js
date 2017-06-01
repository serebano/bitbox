import _curry2 from "./internal/curry2"

export default _curry2(function map(fn, functor) {
    switch (Object.prototype.toString.call(functor)) {
        case "[object Function]":
            return function mapFn() {
                return fn.call(this, functor.apply(this, arguments))
            }
        case "[object Object]":
            return Object.keys(functor).reduce(function(acc, key) {
                acc[key] = fn(functor[key])
                return acc
            }, {})
        default:
            return _map(fn, functor)
    }
})

function _map(fn, functor) {
    var idx = 0
    var len = functor.length
    var result = Array(len)
    while (idx < len) {
        result[idx] = fn(functor[idx])
        idx += 1
    }
    return result
}
