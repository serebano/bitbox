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
const keyTypes = ["string", "number", "function", "symbol"]
const iterator = keys => Array.prototype[Symbol.iterator].bind(keys)
const validate = key => {
    if (keyTypes.includes(typeof key) || key instanceof Mapping || is.array(key)) return key
    throw new Error(`Invalid key "${String(key)}" type "${typeof key}"`)
}

function create(keys = [], isRoot = true) {
    return createProxy(
        [].concat(Array.from(keys)).map(key => {
            if (is.object(key)) return new Mapping(key)
            return validate(key)
        }),
        isRoot
    )
}

function createProxy(keys, isRoot = true) {
    const root = keys
    const bitbox = () => {}

    const proxy = new Proxy(bitbox, {
        apply(target, context, args) {
            if (isRoot) keys = root.slice(0)
            if (args.length && is.complexObject(args[0])) {
                return resolve(args[0], keys, ...args.slice(1))
            }

            return create(keys.concat(args))
        },
        get(box, key) {
            if (isRoot) keys = root.slice(0)
            const currentKey = keys[keys.length - 1]

            if (key === "$") return toArray(keys)
            if (key === "apply") return Reflect.get(box, key)
            if (key === "toJSON") return () => toJSON(keys)
            if (key === "displayName") return toPrimitive(keys)
            if (key === Symbol.isConcatSpreadable) return false
            if (key === Symbol.iterator) return iterator(keys)
            if (key === Symbol.toPrimitive) return primitive(keys)
            if (key === Symbol.toStringTag) return identity
            if (currentKey instanceof Mapping) return Reflect.get(currentKey, key)

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
