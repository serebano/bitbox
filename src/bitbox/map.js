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
            return Reflect.has(mapping, key)
                ? bitbox.get(target, Reflect.get(mapping, key))
                : bitbox.get(target, [key])
        },
        set(mapping, key, value) {
            return Reflect.has(mapping, key)
                ? bitbox.set(target, Reflect.get(mapping, key), value)
                : bitbox.set(target, [key], value)
        }
    })
}

export default map
