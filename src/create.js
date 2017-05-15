import resolve from "./resolve"
import construct from "./construct"

import { is, toPrimitive, toJSON, toArray } from "./utils"

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

function create(arg, isBox) {
    return create.proxy(
        arg.map((key, idx) => {
            if (is.func(key)) return construct(key, create(arg.slice(0, idx)))
            if (keyTypes.includes(typeof key)) return key
            throw new Error(`Invalid key "${String(key)}" type "${typeof key}"`)
        }),
        true,
        isBox
    )
}

create.proxy = function(keys, isRoot = true, isBox = false) {
    function box() {}

    const root = keys
    const proxy = new Proxy(box, {
        construct(_, [target, ...args]) {
            const targetArgs = [create.proxy(keys, true, true), ...args]
            const instance = Reflect.construct(target, targetArgs)
            if (is.undefined(instance))
                throw new Error(
                    `box#construct 'construct' on box: ${target.name} returned non-object (${instance})`
                )

            console.log(`args`, args, instance)
            // if (is.box(instance)) return resolve(args[0], instance, ...args.slice(1))
            //
            // if (args.length && is.complexObject(args[0])) {
            //     const [target, ...rest] = args
            //
            //     return resolve(target, instance, ...rest)
            // }

            return instance
        },
        apply(target, thisArg, args) {
            if (isRoot) keys = root.slice(0)
            if (!isBox && args.length && is.complexObject(args[0])) {
                const [target, ...rest] = args
                return resolve(target, keys, ...rest)
            }

            if (args.length) keys.push(...args.map(validate))

            return create.proxy(keys, true, isBox)
        },
        get(box, key, receiver) {
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
            if (Reflect.has(box, key, receiver)) return Reflect.get(box, key, receiver)

            keys.push(!is.undefined(__keys) && key === __key ? __keys : key)

            __keys = undefined
            __key = undefined

            return isRoot ? create.proxy(keys, false, isBox) : proxy
        },
        set(box, key, value, receiver) {
            const map = keys.slice().pop()
            console.log(`box.set(${key})`, value, receiver, map)

            if (is.object(map)) return Reflect.set(map, key, value)
            return Reflect.set(box, key, value, receiver)
        },
        has(box, key) {
            return true
        }
    })

    box.toString = () => `function ${proxy}(object) {}`

    return proxy
}

export default create
