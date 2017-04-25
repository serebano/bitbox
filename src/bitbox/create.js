import { is, toPrimitive, toJSON, toArray } from "../utils"
import bitbox, { symbol } from "."

let keyPath, keyPrimitive

function create(keys = [], isRoot = true) {
    return createProxy([...keys], isRoot)
}

function createProxy(keys, isRoot) {
    let mapping
    let root = (keys = keys.map((key, idx) => {
        if (is.object(key)) {
            mapping = bitbox.map(key)
            //console.log(`mapping`, mapping)
            return mapping
        }
        return key
    }))

    const proxy = new Proxy(
        Object.defineProperties(function box() {}, {
            keys: {
                get: () => keys
            },
            mapping: {
                value: mapping
            },
            toString: {
                value: () => toPrimitive(root)
            }
        }),
        {
            apply(box, context, args) {
                if (isRoot) keys = root.slice(0)
                if (is.complexObject(args[0]) && !(args[0] instanceof bitbox.map))
                    return bitbox.resolve(args[0], keys, ...args.slice(1))

                const object =
                    is.complexObject(args[args.length - 1]) &&
                    !(args[args.length - 1] instanceof bitbox.map) &&
                    args.pop()

                args.length && keys.push(...args)

                try {
                    if (object) return bitbox.resolve(object, keys)

                    return args.length ? create(keys) : proxy
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
                if (box.mapping) return Reflect.get(box.mapping, key)

                if (keyPath !== undefined && keyPrimitive === key) {
                    keys.push(keyPath)
                    keyPath = undefined
                    keyPrimitive = undefined
                } else {
                    keys.push(key)
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
