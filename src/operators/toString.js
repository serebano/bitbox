import curry from "../curry"
import _toString from "../curry/toString"

export default curry(function toString(val) {
    return _toString(val, [])
})
