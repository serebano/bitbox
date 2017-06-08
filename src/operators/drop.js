import curry from "../curry"
import slice from "./slice"

export default curry(function drop(n, xs) {
    return slice(Math.max(0, n), Infinity, xs)
})
