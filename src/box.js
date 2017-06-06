import is from "./is"
import curry from "./curry"
import { toPrimitive, toJSON } from "./utils"
import resolve from "./resolve"
import * as api from "./operators"
import { get, has, apply, last, log } from "./operators"

export default function create(box, path = [], handler) {
    const proxy = new Proxy(box, {
        apply(target, thisArg, args) {
            // if (handler && handler.apply) {
            //     return handler.apply(target, [path, args])
            // }
            return Reflect.apply(target, thisArg, [path, args])
        },
        get(target, key, receiver) {
            if (key === "$") return path
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(path)
            if (key === Symbol.toPrimitive) return primitive(path)
            if (key === "toJSON") return () => toJSON(path)
            if (key === Symbol.for("box/path")) return [box, path]
            if (target && Reflect.has(target, key)) {
                const f = Reflect.get(target, key)
                if (is.func(f)) return create(f, path.slice(), handler)
            }
            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : is.numeric(key) ? parseInt(key) : key

            delete primitive.__key
            delete primitive.__keys

            if (handler && handler.get) {
                return handler.get(path, nextKey, target)
            }

            return create(box, path.concat(nextKey), handler)
        },
        has(target, key, receiver) {
            if (key === Symbol.for("box/path")) return true
            if (has(key, api)) return true
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

export const x = (box, handler = {}) => {
    function _box(path, args) {
        path = path.slice()
        args = args.slice()

        const pathLen = path.length
        const argsLen = args.length
        const lastKey = pathLen && path[pathLen - 1]
        const lastArg = argsLen && args[argsLen - 1]

        const isMethod = lastKey && has(lastKey, api)
        const method = isMethod && get(lastKey, api)

        if (isMethod) {
            const methodLen = method.length
            const methodName = method.name
            log({ pathLen, argsLen, methodLen, methodName, method, path, args })

            //path.pop()

            if (argsLen >= methodLen) {
                const methodArgs = args.slice(0, methodLen - 1)
                const target = args.pop() //args.slice(methodLen - 1, 1).pop()
                const resolved = resolve(path.concat(apply(method, methodArgs)), target)
                //const result = apply(method, methodArgs.concat(resolved))
                return resolved
            }

            const result = apply(method, args.slice(0, methodLen))
            const resultLen = result.length
            //console.log(`(apply/method/create)`, { method, methodLen, argsLen, path, args, result })
            return create(box, path.concat(result), handler, api)
        }

        if (lastArg && !is.func(lastArg)) {
            const target = args.pop()
            //console.warn(`(apply/resolve)`, { pathLen, argsLen, isMethod, lastKey, target, path, args })
            return resolve(path.concat(args), target)
        }

        return create(box, path.concat(args), handler)
    }

    // const handler = {
    //     get(path, key, proxy) {
    //         if (key === "apply") return (context, args) => handler.apply(path, args, proxy)
    //         if (key === "length" && is.func(path[path.length - 1])) return path[path.length - 1].length
    //         if (has(key, api)) {
    //             return create(box, path.concat(get(key, api)), handler)
    //         }
    //
    //         return create(box, path.concat(key), handler, api)
    //     },
    //     has(path, key) {
    //         return has(key, api)
    //     }
    // }

    return create(box, [], handler)
}

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}
