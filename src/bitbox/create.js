import { is, toPrimitive, toJSON, toArray } from "../utils"
import bitbox, { symbol } from "."

let keyPath, keyPrimitive

function create(keys = [], isRoot = true) {
    const root = [...keys]

    return createProxy(root, isRoot, root)
}

function createProxy(keys, isRoot, root) {
    const proxy = new Proxy(function box() {}, {
        apply(box, context, args) {
            if (isRoot) keys = root.slice(0)
            if (is.object(args[0])) return bitbox.resolve(args[0], keys, ...args.slice(1))

            const object = is.complexObject(args[args.length - 1]) && args.pop()
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

            if (key === "$") return [keys, isRoot, root]
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

            const mapping = keys.length && keys[keys.length - 1]
            if (is.object(mapping) && Reflect.has(mapping, key)) return Reflect.get(mapping, key)

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
    })

    return proxy
}

export default create
