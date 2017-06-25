import curry from "../curry"
import pipe from "./pipe"

export default curry(function to(toMap, target) {
    const obj = {}
    for (const key in toMap) {
        const f = toMap[key]
        obj[key] = Array.isArray(f) ? pipe(f)(target) : f(target)
    }
    return obj
})
