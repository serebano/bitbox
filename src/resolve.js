import is from "./is"
import curry2 from "./internal/curry2"
import isFunction from "./internal/isFunction"
import { curry, functionLength, functionName } from "./fantasy-helpers"
import * as api from "./operators"
/**
 * resolve()
 *
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

function resolve(path, target) {
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
}

//if (is.object(key)) return resolve(path.slice(index), key)
//if (index === path.length - 1) return func(object, key, index, path)

export default curry2(resolve)
