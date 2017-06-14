import is from "./is"
import curry from "./curry"
import { toPrimitive } from "./utils"
import { get, has, apply, last, log } from "./operators"

function create(box, path = [], handler) {
    const proxy = new Proxy(box, {
        apply(target, context, args) {
            return Reflect.apply(target, context, [path].concat(args))
        },
        get(target, key, receiver) {
            if (key === "$") return { box, target, path }
            if (key === Symbol.for("box")) return true
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(path)
            if (key === Symbol.toPrimitive) return primitive(path)
            if (key === "length" || key === "apply" || key === "call") return target[key]
            if (key === "displayName") return toPrimitive(path)
            if (key === "toString") return (...a) => target.toString(...a)

            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : is.numeric(key) ? parseInt(key) : key

            delete primitive.__key
            delete primitive.__keys

            if (handler && handler.get) {
                return handler.get(path, nextKey, box)
            }

            return create(target, path.concat(nextKey), handler)
        },
        has(target, key, receiver) {
            if (key === Symbol.for("box")) return true
            if (handler && handler.has) {
                return handler.has(path, key, receiver)
            }
            return true
        },
        set(target, key, value, receiver) {
            if (handler && handler.set) {
                return handler.set(path, key, value, receiver)
            }
        }
    })

    return proxy
}

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}

export default create
