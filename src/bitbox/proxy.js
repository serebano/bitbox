import bitbox from "."
import Mapping from "./map"

/**
 * bitbox.proxy
 * @param  {Object} target
 * @param  {Object} mapping
 * @return {Object}
 */

function proxy(target, mapping, root) {
    return new Proxy(new Mapping(mapping, root), {
        get(mapping, key) {
            return Reflect.has(mapping, key)
                ? bitbox.get(target, Reflect.get(mapping, key))
                : Reflect.get(target, key)
        },
        set(mapping, key, value) {
            return Reflect.has(mapping, key)
                ? bitbox.set(target, Reflect.get(mapping, key), value)
                : Reflect.set(target, key, value)
        }
    })
}

export default proxy
