import { is } from "../utils"

/**
 * bitbox.resolve
 *
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

function map(target, mapping) {
    return new Proxy(mapping, {
        get(map, key) {
            if (Reflect.has(map, key)) {
                const value = Reflect.get(map, key)
                return resolve(target, Reflect.get(map, key))
            }
        },
        set(map, key, value) {
            if (Reflect.has(map, key)) return resolve(target, Reflect.get(map, key), value)
        }
    })
}

function resolve(target, box, ...args) {
    return Array.from(box).reduce((value, key, index, path) => {
        if (is.box(key)) return resolve(value, key)
        if (is.func(key)) return key(value)
        if (is.array(key)) key = resolve(target, key)
        if (is.object(key)) return map(value, key)

        if (args.length && (!path.length || index === path.length - 1)) {
            if (!is.string(key) && !is.number(key)) {
                throw new Error(
                    `[resolve] Invalid key type "${typeof key}" for method "${args[0].name}" [${path.join(".")}]`
                )
            }
            const [method, ...rest] = args
            if (!is.func(method) || is.box(method))
                return Reflect.set(value, key, toValue(target)(method))

            return method(value, key, ...rest.map(toValue(target)))
        }

        return Reflect.get(value, key)
    }, target || {})
}

function toValue(target) {
    return arg => (is.box(arg) ? resolve(target, arg) : arg)
}

export default resolve
