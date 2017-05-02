import create from "./create"
import { is } from "../utils"
import bitbox from "."
import * as operators from "../operators"

/**
 * bitbox.map(mapping, context)
 * @param {Object} mapping
 * @param {Function} context
 */

function Mapping(mapping, context, strict) {
    if (mapping instanceof Mapping) return mapping

    if (is.func(mapping)) {
        return new Mapping(
            mapping(
                new Proxy(new Mapping(context), {
                    get(box, key) {
                        if (Reflect.has(box, key)) return Reflect.get(box, key)
                        if (!strict) return bitbox(key)
                    }
                }),
                operators
            )
        )
    }

    return Object.keys(mapping || {}).reduce((map, key) => {
        const value = Reflect.get(mapping, key)

        if (is.array(value) || is.box(value)) {
            Reflect.set(map, key, create(value))
        } else if (is.func(value) || is.object(value)) {
            Reflect.set(map, key, create([value]))
        } else {
            console.warn(`mapping key -> ${key}`, mapping)
        }

        return map
    }, this)
}

export default Mapping
