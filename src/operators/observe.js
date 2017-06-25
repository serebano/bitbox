import curry from "../curry"
import { observe, observable } from "../observer"

export default curry(function observer(fn, target) {
    return observe(() => fn(target))
})
