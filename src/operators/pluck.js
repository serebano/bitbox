import curry from "../curry"
import map from "./map"
import get from "./get"

export default curry(function pluck(key, target) {
    return map(get(key), target)
})
