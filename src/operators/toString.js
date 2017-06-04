import curry from "../curry"
import _toString from "../internal/toString"

export default curry(function toString(val) {
    return _toString(val, [])
})
