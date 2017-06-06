import is from "./is"
import curry from "./curry"
import * as api from "./operators"
/**
 * resolve()
 *
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

export default curry(function resolve(path, target) {
    return path.reduce((obj, key, index, path) => {
        if (is.undefined(obj)) return obj
        if (is.array(key)) key = resolve(key, target)
        if (is.func(key)) {
            return key(obj)
        }
        const value = obj[key]
        if (is.func(value)) {
            return value.apply(obj, path.slice(index + 1))
        }
        return value
    }, target)
})
