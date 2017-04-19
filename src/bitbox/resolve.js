import { is, toPrimitive } from "../utils"
import bitbox from "."

/**
 * bitbox.resolve
 *
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

function resolve(target, box, method) {
    return bitbox.path(box).reduce((value, key, index, path) => {
        if (is.array(key)) key = resolve(target, key)

        const type = typeof key

        if (type === "object") return bitbox.map(value, key)
        if (type === "function") return key(value)

        if (method && (!path.length || index === path.length - 1)) {
            if (type !== "string") {
                throw new Error(
                    `[bitbox.resolve] Invalid key type "${type}" for method "${method.name}"`
                )
            }

            return Reflect.apply(
                method,
                undefined,
                [value, key].concat(
                    Array.prototype.slice
                        .call(arguments, 3)
                        .map(arg => (is.box(arg) ? arg(target) : arg))
                )
            )
        }

        if (is.undefined(value)) {
            throw new Error(`[bitbox.resolve] Undefined value at path: [${toPrimitive(path)}]`)
        }

        return Reflect.get(value, key)
    }, target)
}

export default resolve
