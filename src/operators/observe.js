import curry from "../curry"
import { observe } from "../observer"
import get from "./get"

export default curry(function observe(key, fn, target) {
    return observe(() => fn(get(key, target)))
})
