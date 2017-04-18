import { is } from "../utils"
import bitbox from "."

/**
 * bitbox.map
 * @param  {Object} target
 * @param  {Object} mapping
 * @return {Object}
 */

function map(target, mapping) {
    return new Proxy(mapping, {
        get(mapping, key) {
            return Reflect.has(mapping, key) ? bitbox.get(target, Reflect.get(mapping, key)) : Reflect.get(target, key)
        },
        set(mapping, key, value) {
            const resolved = is.box(value) ? value(target) : value

            return Reflect.has(mapping, key)
                ? bitbox.set(target, Reflect.get(mapping, key), resolved)
                : Reflect.set(target, key, resolved)
        }
    })
}

export default map
