import Mapping from "./mapping"
import resolve from "./resolve"
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
const keyTypes = ["string", "number", "function", "symbol", "object"]
const iterator = keys => Array.prototype[Symbol.iterator].bind(keys)
const validate = key => {
    if (keyTypes.includes(typeof key)) return key
    throw new Error(`Invalid key "${String(key)}" type "${typeof key}"`)
}

function create(arg) {
    if (is.func(arg) || is.object(arg)) {
        const mapping = new Mapping(...arguments)

        map.mapping = mapping
        map.displayName = toPrimitive([mapping])
        map.toJSON = () => mapping

        function map(target) {
            return new Proxy(mapping, {
                get(map, key) {
                    if (Reflect.has(map, key)) return resolve(target, Reflect.get(map, key))
                },
                set(map, key, value) {
                    if (Reflect.has(map, key)) return resolve(target, Reflect.get(map, key), value)
                }
            })
        }
        return createProxy([map])
    }
    return createProxy(arg.map(validate))
}

function createProxy(keys, isRoot = true) {
    const root = keys
    const bitbox = () => {}

    const proxy = new Proxy(bitbox, {
        apply(target, thisArg, args) {
            if (isRoot) keys = root.slice(0)

            if (args.length && is.complexObject(args[0])) {
                const [target, ...rest] = args
                return resolve(target, keys, ...rest)
            }

            if (args.length) keys.push(...args.map(validate))

            return createProxy(keys)
        },
        get(box, key) {
            if (isRoot) keys = root.slice(0)

            if (key === "$") return toArray(keys)
            if (key === "apply") return Reflect.get(box, key)
            if (key === "toJSON") return () => toJSON(keys)
            if (key === "displayName") return toPrimitive(keys)
            if (key === Symbol.isConcatSpreadable) return false
            if (key === Symbol.iterator) return iterator(keys)
            if (key === Symbol.toPrimitive) return primitive(keys)
            if (key === Symbol.toStringTag) return identity

            keys.push(!is.undefined(__keys) && key === __key ? __keys : key)

            __keys = undefined
            __key = undefined

            return isRoot ? createProxy(keys, false) : proxy
        },
        has(box, key) {
            return true
        }
    })

    return proxy
}

export default create
