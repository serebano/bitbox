import is from "./is"
import curry2 from "./internal/curry2"
import isFunction from "./internal/isFunction"

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
        if (is.array(key)) key = resolve(key, target)
        if (is.func(key)) return key(obj)
        if (isFunction(obj[key])) {
            return obj[key].apply(obj, path.slice(index + 1))
        }

        return Reflect.get(obj, key)
    }, target)
}

//if (is.object(key)) return resolve(path.slice(index), key)
//if (index === path.length - 1) return func(object, key, index, path)

export default curry2(resolve)
