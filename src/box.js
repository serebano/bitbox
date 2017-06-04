import is from "./is"
import curry from "./curry"
import { toPrimitive } from "./utils"
import resolve from "./resolve"
import * as api from "./operators"
import { get, has, apply, last, log } from "./operators"
import { functionLength, functionName } from "./fantasy-helpers"

export function create(path = [], handler, api) {
    const proxy = new Proxy(function box() {}, {
        apply(target, thisArg, args) {
            if (handler && handler.apply) return handler.apply(path, args, proxy, thisArg)
            return Reflect.apply(target, thisArg, [path, args])
        },
        get(target, key, receiver) {
            if (key === "$") return path
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(path)
            if (key === Symbol.toPrimitive) return primitive(path)
            if (key === "toJSON") return primitive(path)

            if (key === Symbol.for("box/path")) return true

            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : is.numeric(key) ? parseInt(key) : key

            delete primitive.__key
            delete primitive.__keys

            if (handler && handler.get) {
                return handler.get(path, nextKey, proxy)
            }

            return create(path.concat(nextKey), handler)
        },
        has(target, key, receiver) {
            if (key === Symbol.for("box/path")) return true
            if (has(key, api)) return true
            if (handler && handler.has) {
                return handler.has(path, key, receiver)
            }
            return true
        }
    })

    return proxy
}

export default (path = [], api = {}) => {
    const handler = {
        get(path, key, proxy) {
            if (key === "apply") return (context, args) => handler.apply(path, args, proxy)
            if (key === "length") {
                if (is.func(path[path.length - 1])) return path[path.length - 1].length
                else return 1
            }
            if (has(key, api)) {
                const method = get(key, api)
                return create(path.concat(method), handler)
            }

            return create(path.concat(key), handler, api)
        },
        apply(_path, _args, proxy) {
            const path = _path.slice()
            const args = _args.slice()
            const pathLen = path.length
            const argsLen = args.length
            const lastKey = pathLen && path[pathLen - 1]
            const lastArg = argsLen && args[argsLen - 1]

            const isMethod = lastKey && (is.func(lastKey) || has(lastKey, api))

            log({ pathLen, argsLen, isMethod, lastKey, lastArg, path, args })

            if (isMethod) {
                const method = is.func(lastKey) ? lastKey : get(lastKey, api)
                const methodLen = method.length
                const methodName = method.name
                path.pop()

                if (argsLen >= methodLen) {
                    //apply(method, args.slice(0, methodLen - 1))
                    const methodArgs = args.slice(0, methodLen - 1)
                    const target = args.pop() //args.slice(methodLen - 1, 1).pop()
                    const resolved = resolve(path.concat(apply(method, methodArgs)), target)

                    //const result = apply(method, methodArgs.concat(resolved))

                    return resolved
                }

                const result = apply(method, args.slice(0, methodLen))
                const resultLen = result.length

                console.log(`(apply/method/create)`, { method, methodLen, argsLen, path, args, result })
                //return result
                return create(path.concat(result), handler, api)
            }

            if (lastArg && !is.func(lastArg)) {
                const target = args.pop()
                //console.warn(`(apply/resolve)`, { pathLen, argsLen, isMethod, lastKey, target, path, args })

                return resolve(path.concat(args), target)
            }

            return create(path.concat(args), handler)
        },
        has(path, key) {
            return has(key, api)
        }
    }

    return create(path, handler, api)
}

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}
