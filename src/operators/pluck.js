import box from "../box"
import map from "./map"
import get from "./get"

export default box(function pluck(key, target) {
    return map(get(key), target)
})
