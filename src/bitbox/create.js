import resolve from "./resolve"
import mapping from "./mapping"
import box from "./box"
import * as operators from "../operators"
import { is, toPrimitive, toJSON, toArray } from "../utils"

export const symbol = {
    path: Symbol("bitbox.path"),
    map: Symbol("bitbox.map")
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

function create(arg, isMap) {
    if (is.object(arg) || is.func(arg)) return create.box(arg)

    return create.proxy(
        arg.map(key => {
            if (is.object(key) || is.func(key)) return create.box(key)
            if (keyTypes.includes(typeof key)) return key
            throw new Error(`Invalid key "${String(key)}" type "${typeof key}"`)
        }),
        true,
        isMap
    )
}

create.box = input => box(input)

create.proxy = function(keys, isRoot = true, isMap = false) {
    let map

    if (is.object(keys)) {
        map = keys
        keys = [map]
    }

    const box = () => {}
    const root = keys

    const proxy = new Proxy(box, {
        apply(target, thisArg, args) {
            if (isRoot) keys = root.slice(0)

            if (isMap) {
                if (is.object(args[0]) || (is.func(args[0]) && !is.box(args[0]))) {
                    console.log(keys, args)
                    return create.box(args[0])
                }
            }

            if (args.length && is.complexObject(args[0])) {
                const [target, ...rest] = args
                return map ? resolve(target, map, ...rest) : resolve(target, keys, ...rest)
            }

            if (args.length > 1 && is.func(args[0])) {
                const operator = args.shift()
                return create.proxy(keys.concat(operator(...args)))
            }

            if (args.length) keys.push(...args.map(validate))

            return create.proxy(keys)
        },
        get(box, key) {
            if (isRoot) keys = root.slice(0)
            if (map && Reflect.has(map, key)) return Reflect.get(map, key)

            if (key === "$") return keys
            if (key === "apply") return Reflect.get(box, key)
            if (key === "toArray") return () => toArray(keys)
            if (key === "toJSON") return () => toJSON(keys)
            if (key === "displayName") return toPrimitive(keys)
            if (key === Symbol.isConcatSpreadable) return false
            if (key === Symbol.iterator) return iterator(keys)
            if (key === Symbol.toPrimitive) return primitive(keys)
            if (key === Symbol.toStringTag) return identity

            keys.push(!is.undefined(__keys) && key === __key ? __keys : key)

            __keys = undefined
            __key = undefined

            return isRoot ? create.proxy(keys, false) : proxy
        },
        has(box, key) {
            return true
        }
    })

    box.toString = () => `function ${proxy}(object) {}`

    return proxy
}

export default create
