import is from "./is"
import { observe } from "./observer"
import project from "./project"

/**
 * bitbox.resolve
 *
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

function resolve(target, args, value) {
    return Array.from(args).reduce((object, key, index, path) => {
        if (is.array(key)) key = resolve(target, key)
        if (is.object(key)) return project(object, key)
        if (is.box(key)) return resolve(object, key)
        if (is.func(key)) return key(object)

        if (arguments.length === 3 && index === path.length - 1)
            return Reflect.set(object, key, value)

        if (!Reflect.has(object, key) && index < path.length - 1) Reflect.set(object, key, {})

        return Reflect.get(object, key)
    }, target)
}

export default resolve
