import Mapping from "./map"
import { is, toPrimitive, toJSON, toArray } from "../utils"

export const symbol = {
    path: Symbol("bitbox.path")
}

/** primitive key transfer */
let __keys, __key
const primitive = keys => {
    __keys = keys
    return () => __key = toPrimitive(keys)
}
const identity = () => "bitbox"
const keyTypes = ["string", "number", "array", "object", "function"]
const iterator = keys => Array.prototype[Symbol.iterator].bind(keys)
const mappedKey = (mapping, key) =>
    (Reflect.has(mapping, key)
        ? Reflect.get(mapping, key)
        : Reflect.has(mapping, "*") && Reflect.get(mapping, "*")[key])

function create(keys = [], isRoot = true) {
    keys = [...keys]
    const box = is.func(keys[0]) && keys[0].name === "box" && keys.shift()

    return createProxy(keys, isRoot, box)
}

function createProxy(keys, isRoot, $box) {
    const root = (keys = keys.map(key => {
        if (!keyTypes.includes(typeof key))
            throw new Error(`Invalid key "${String(key)}" type "${typeof key}"`)
        return is.object(key) ? new Mapping(key) : key
    }))

    const proxy = new Proxy($box || function box() {}, {
        apply(target, context, args) {
            if (isRoot) keys = root.slice(0)
            if ($box) return $box.apply(context, [keys, args, proxy])

            keys.push(...args)

            return isRoot ? createProxy(keys, false, $box) : proxy
        },
        get(box, key, receiver) {
            if (isRoot) keys = root.slice(0)
            const currentKey = keys[keys.length - 1]

            if (key === "$") return keys
            if (key === "apply") return Reflect.get(box, key)
            if (key === "toJSON") return () => toJSON(keys)
            if (key === "toArray") return () => toArray(keys)
            if (key === "displayName") return toPrimitive(keys)
            if (key === symbol.path) return keys
            if (key === Symbol.isConcatSpreadable) return false
            if (key === Symbol.iterator) return iterator(keys)
            if (key === Symbol.toPrimitive) return primitive(keys)
            if (key === Symbol.toStringTag) return identity

            keys.push(!is.undefined(__keys) && key === __key ? __keys : key)
            __keys = undefined
            __key = undefined

            if (currentKey instanceof Mapping) return mappedKey(currentKey, key)

            return isRoot ? createProxy(keys, false, $box) : proxy
        },
        has(box, key) {
            return true
        }
    })

    return proxy
}

export default create
