import is from "./is"
import curry2 from "./internal/curry2"
import isFunction from "./internal/isFunction"
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
    return path.reduce((obj, key, index) => {
        if (is.array(key)) key = resolve(key, target)
        if (is.func(key)) return key(obj)
        // if (is.func(api[key])) {
        //     const f = api[key]
        //     const args = path.splice(index + 1)
        //     console.log(`api`, { path, index, f, obj, args })
        //     return f.apply(obj, args.concat(obj))
        // }
        const value = obj[key]

        if (is.func(value)) {
            const args = path.splice(index + 1, 1)
            //console.log(`resolve fn`, { path, index, value, obj, args })
            return value.apply(obj, args)
        }

        return value
    }, target)
}

//if (is.object(key)) return resolve(path.slice(index), key)
//if (index === path.length - 1) return func(object, key, index, path)

export default curry2(resolve)
