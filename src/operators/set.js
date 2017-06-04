import curry from "../curry"
import is from "../is"

function set(key, value, target) {
    target[key] = is.func(value) ? value(target[key]) : value

    return target[key]
}

export default curry(set)
