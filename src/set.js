import curry3 from "./internal/curry3"
import is from "./is"

function set(key, value, target) {
    target[key] = is.func(value) ? value(target[key]) : value

    return target
}

export default curry3(set)
