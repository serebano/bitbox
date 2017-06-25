import is from "./is"
import curry from "./curry"
import apply from "./operators/apply"
import get from "./operators/get"

/**
 * resolve()
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

export default curry(function resolve(path, target) {
    return path.reduce((obj, key, index, path) => {
        if (is.undefined(obj)) return obj
        if (is.array(key)) key = resolve(key, target)
        if (is.func(key)) return key(obj)

        const value = obj[key]
        if (is.func(value)) {
            const args = path.splice(index + 1, value.length - 1)
            console.log(`args`, { value, obj, args })
            return value.apply(obj, args)
        }
        return value
    }, target)
})
