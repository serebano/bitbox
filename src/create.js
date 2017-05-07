import resolve from "./resolve"
import mapping from "./mapping"
import map from "./map"
import box from "./box"
import * as operators from "./operators"
import { is, toPrimitive, toJSON, toArray } from "./utils"

export const symbol = {
    path: Symbol("bitbox.path"),
    map: Symbol("bitbox.map")
}
/** primitive key transfer */
let __keys, __key
const primitive = keys => {
    __keys = keys
    return () => (__key = toPrimitive(keys))
}
const identity = () => "bitbox"
const keyTypes = ["string", "number", "function", "symbol", "object"]
const iterator = keys => Array.prototype[Symbol.iterator].bind(keys)
const validate = key => {
    if (keyTypes.includes(typeof key)) return key
    throw new Error(`Invalid key "${String(key)}" type "${typeof key}"`)
}

function create(arg, ...args) {
    if (is.object(arg) || is.func(arg)) return map.box(arg, ...args)
    if (is.object(arg[0]) || is.func(arg[0])) return map.box(...arg)

    return create.proxy(
        arg.map(key => {
            if (is.object(key) || is.func(key)) return create.map(key)
            if (keyTypes.includes(typeof key)) return key
            throw new Error(`Invalid key "${String(key)}" type "${typeof key}"`)
        })
    )
}

create.proxy = function(keys, isRoot = true) {
    console.log(`create.proxy`, keys)
    const box = () => {}
    const root = keys
    const proxy = new Proxy(box, {
        apply(target, thisArg, args) {
            if (is.map(keys)) {
                const [target, ...rest] = args
                return map(target, keys, ...rest)
            }

            if (isRoot) keys = root.slice(0)

            if (args.length && is.complexObject(args[0])) {
                const [target, ...rest] = args
                return resolve(target, keys, ...rest)
            }

            if (args.length > 1 && is.func(args[0])) {
                const operator = args.shift()
                return create.proxy(keys.concat(operator(...args)))
            }

            if (args.length) keys.push(...args.map(validate))

            return create.proxy(keys)
        },
        get(box, key) {
            if (is.map(keys)) return Reflect.get(keys, key)

            if (isRoot) keys = root.slice(0)

            if (key === "$") return keys
            if (key === symbol.path) return keys
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
