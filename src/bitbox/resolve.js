import { is } from "../utils"
import bitbox from "."

/**
 * bitbox.resolve
 *
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

function toValue(target) {
    return arg => (is.box(arg) ? resolve(target, arg) : arg)
}

function map(target, mapping) {
    return new Proxy(mapping, {
        get(map, key) {
            if (Reflect.has(map, key)) return resolve(target, Reflect.get(map, key))
        },
        set(map, key, value) {
            if (Reflect.has(map, key))
                return resolve(target, Reflect.get(map, key), Reflect.set, value)
        }
    })
}

function resolve(target, box, method) {
    return Array.from(box).reduce((value, key, index, path) => {
        if (is.array(key)) {
            key = resolve(target, key)
        }

        if (is.box(key)) return resolve(value, key)

        const type = typeof key

        if (type === "object") return map(value, key)
        if (type === "function") {
            return Reflect.apply(
                key,
                undefined,
                key.args ? [value].concat(key.args.map(toValue(target))) : [value]
            )
        }

        if (method && (!path.length || index === path.length - 1)) {
            if (type !== "string" && type !== "number") {
                throw new Error(
                    `[bitbox.resolve] Invalid key type "${type}" for method "${method.name}" [${path.join(".")}]`
                )
            }

            return Reflect.apply(
                method,
                undefined,
                [value, key].concat(Array.prototype.slice.call(arguments, 3).map(toValue(target)))
            )
        }

        if (!is.complexObject(value)) {
            console.log({ target, value, key, box, path })
            throw new Error(`resolve error: "${key}" (${box})`)
        }

        return Reflect.get(value, key)
    }, target || {})
}

export default resolve
