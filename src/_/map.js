import create, { symbol } from "./create"
import * as operators from "../operators"
import { is, toPrimitive } from "../utils"

/**
 * bitbox.map(mapping, context)
 * @param {Object} mapping
 * @param {Function} context
 */

function proxy(target) {
    return new Proxy(target, {
        get(target, key) {
            if (key === symbol.map) return target
            if (key === "toString") return () => toPrimitive([target])
            if (Reflect.has(target, key)) return create(Reflect.get(target, key))

            return create([key])
        },
        set(target, key, value) {
            if (is.box(value)) {
                return Reflect.set(target, key, value)
            }
        },
        has(target, key) {
            return Reflect.has(target, key)
        }
    })
}

function map(mapping, context) {
    if (!(this instanceof map)) return new map(...arguments)

    if (is.map(mapping)) return mapping
    if (is.func(mapping)) return new map(mapping(new map(context), operators), context)

    Object.keys(mapping || {}).reduce((obj, key) => {
        const value = Reflect.get(mapping, key)

        if (is.array(value)) Reflect.set(obj, key, Array.from(value))
        else if (is.box(value)) Reflect.set(obj, key, Array.from(value))
        else if (is.func(value)) Reflect.set(obj, key, [value])
        else if (is.object(value)) Reflect.set(obj, key, Array.from(create(value, context)))
        else throw new Error(`[mapping] Invalid mapping { ${key}: ${typeof value} }`)

        return obj
    }, this)

    return proxy(this, context)
}

export default map
