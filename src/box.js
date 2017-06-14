import is from "./is"
import curry from "./curry"
import resolve from "./resolve"
import * as functions from "./operators"
import { toPrimitive, toJSON } from "./utils"
import { get, has, apply, last, log } from "./operators"

function create(box, path = [], handler) {
    const proxy = new Proxy(box, {
        apply(target, context, args) {
            //console.log(`(apply)`, path, args)
            if (handler && handler.apply) {
                return handler.apply(path, args, box)
            }
            return apply(target, [path, ...args])
        },
        get(target, key, receiver) {
            if (key === "$") return { box, target, path }
            if (key === Symbol.for("box")) return [box, path]
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(path)
            if (key === Symbol.toPrimitive) return primitive(path)
            if (key === "length" || key === "apply" || key === "call") return target[key]
            if (key === "displayName") return toPrimitive(path)
            if (key === "toString") return a => target.toString(a)
            if (key === "toJSON" || key === "toJS") return () => toJSON(path)

            // if (Reflect.has(functions, key)) {
            //     const fn = Reflect.get(functions, key)
            //
            //     if (is.func(fn)) {
            //         const lastKey = last(path)
            //         const hasKey = fn.argNames && fn.argNames.includes("key")
            //         const fx = hasKey ? fn(path.pop()) : fn
            //         console.log(`(fn:${key}) ->`, fx.length, { lastKey, hasKey, fx, length: fx.length })
            //         return create(box, path.concat(fx), handler)
            //     }
            // }

            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : is.numeric(key) ? parseInt(key) : key

            delete primitive.__key
            delete primitive.__keys

            if (handler && handler.get) {
                return handler.get(path, nextKey, box)
            }

            return create(box, path.concat(nextKey), handler)
        },
        has(target, key, receiver) {
            if (key === Symbol.for("box")) return true
            if (handler && handler.has) {
                return handler.has(path, key, receiver)
            }
            if (has(key, functions)) return true
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
