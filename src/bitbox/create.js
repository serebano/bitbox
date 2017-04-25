import { is, toPrimitive, toJSON, toArray } from "../utils"
import bitbox, { symbol } from "."
import Mapping from "./map"

let keyPath, keyPrimitive

function create(keys = [], isRoot = true) {
    return createProxy([...keys], isRoot)
}

function createProxy(keys, isRoot) {
    let mapping

    const root = (keys = keys.map(key => {
        if (is.object(key)) return (mapping = new Mapping(key))
        return key
    }))

    const proxy = new Proxy(
        Object.defineProperties(function box() {}, {
            keys: { get: () => (isRoot ? root : keys) }
            //mapping: { get: () => mapping }
        }),
        {
            apply(box, context, args) {
                if (isRoot) keys = root.slice(0)

                try {
                    if (is.complexObject(args[0]))
                        return bitbox.resolve(args.shift(), keys, ...args)

                    //if (isRoot) return create(keys.concat(args), false)

                    args.length && keys.push(...args)
                    return create(keys)
                    //return proxy
                } catch (e) {
                    throw e
                }
            },
            get(box, key, receiver) {
                if (isRoot) keys = root.slice(0)

                if (key === "$") return box
                if (key === "apply") return Reflect.get(box, key)
                if (key === "toJSON") return () => toJSON(keys)
                if (key === "toArray") return () => toArray(keys)
                if (key === "displayName") return toPrimitive(keys)

                if (key === symbol.path) return keys
                if (key === Symbol.isConcatSpreadable) return false
                if (key === Symbol.toStringTag) return () => "bitbox"
                if (key === Symbol.iterator) return Array.prototype[Symbol.iterator].bind(keys)
                if (key === Symbol.toPrimitive) {
                    keyPath = keys
                    return () => keyPrimitive = toPrimitive(keys)
                }

                if (is.symbol(key) && Reflect.has(box, key)) return Reflect.get(box, key)

                if (keyPath !== undefined && keyPrimitive === key) {
                    keys.push(keyPath)
                    keyPath = undefined
                    keyPrimitive = undefined
                } else {
                    keys.push(key)
                }

                if (mapping) {
                    return Reflect.has(mapping, key)
                        ? Reflect.get(mapping, key)
                        : Reflect.has(mapping, "*") && Reflect.get(mapping, "*")[key]
                }

                return isRoot ? create(keys, false) : proxy
            },
            set(box, key, value) {
                return Reflect.set(box, is.symbol(key) ? key : Symbol.for(key), value)
            },
            has(box, key) {
                return true
            }
        }
    )

    return proxy
}

export default create
