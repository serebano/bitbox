import curry from "../curry"
import slice from "./slice"
import drop from "./drop"

export default curry(function take(n, xs) {
    if (n < 0) return takeLast(Math.abs(n), xs)
    return slice(0, n, xs)
})

function takeLast(n, xs) {
    return drop(n >= 0 ? xs.length - n : 0, xs)
}
