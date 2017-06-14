import curry from "../curry"
import is from "../is"

export default curry(function reverse(list) {
    return is.string(list) ? list.split("").reverse().join("") : Array.prototype.slice.call(list, 0).reverse()
})
