import curry from "../curry"
import is from "../is"

export default curry(function set(key, value, target) {
    if (is.box(key)) {
        return set(key.$.pop(), value, key(target))
    }
    target[key] = is.func(value) ? value(target[key]) : value

    return target[key]
})
