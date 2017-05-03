import bitbox from "."
import * as operators from "../operators"
import { is } from "../utils"

/**
 * bitbox.map(mapping, context)
 * @param {Object} mapping
 * @param {Function} context
 */

function create(context, strict) {
    return new Proxy(new Mapping(context, strict), {
        get(target, key) {
            if (Reflect.has(target, key)) return bitbox.create(Reflect.get(target, key))

            if (!strict) return bitbox(key)
        },
        set(target, key, value) {
            if (is.box(value)) {
                return Reflect.set(target, key, value)
            }
        }
    })
}

function Mapping(mapping, context, strict) {
    if (mapping instanceof Mapping) return mapping
    if (is.func(mapping)) return new Mapping(mapping(create(context, strict), operators))
    if (!is.map(this)) return new Mapping(...arguments)

    return Object.keys(mapping || {}).reduce((map, key) => {
        let value = Reflect.get(mapping, key)

        if (is.object(value)) value = Array.from(bitbox.create(value, context, strict))
        else if (is.array(value)) value = Array.from(value)
        else if (is.box(value)) value = Array.from(value)
        else if (is.func(value)) value = [value]
        else throw new Error(`[mapping] Invalid mapping { ${key}: ${typeof value} }`)

        Reflect.set(map, key, value)

        return map
    }, this)
}

export default Mapping
