import is from "./is"
import curryN from "./curryN"
import curry2 from "./internal/curry2"

import { toPrimitive } from "./utils"
import resolve from "./resolve"
import * as api from "./operators"
import { curry, functionLength, functionName } from "./fantasy-helpers"

export function create(path = [], handler) {
    const proxy = new Proxy(function box() {}, {
        apply(target, thisArg, args) {
            if (handler && handler.apply) {
                return handler.apply(path, args, proxy, thisArg)
            }
            return Reflect.apply(target, thisArg, [path, args])
        },
        get(target, key, receiver) {
            if (key === "$") return path
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(path)
            if (key === Symbol.toPrimitive) return primitive(path)

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
            return path.indexOf(key) > -1
        }
    })
    return proxy
}

const get = curry2(function get(key, target) {
    return target[key]
})
const has = curry2(function get(key, target) {
    return key in target
})
const apply = curry2(function apply(fn, args) {
    //    const fnLen = functionLength(fn)
    return fn.apply(this, args)
})

export const handler = {
    get(path, key) {
        if (key === "_length") return path[path.length - 1].length
        if (has(key, api)) {
            const method = get(key, api)
            if (!method._name) method._name = key
            return create(path.concat(method), handler)
        }

        return create(path.concat(key), handler)
    },
    apply(_path, _args, proxy) {
        const path = _path.slice()
        const args = _args.slice()
        const pathLen = path.length
        const argsLen = args.length
        const lastKey = pathLen && path[pathLen - 1]
        const lastArg = argsLen && args[argsLen - 1]

        const isMethod = lastKey && (is.func(lastKey) || has(lastKey, api))

        if (isMethod) {
            const method = is.func(lastKey) ? lastKey : get(lastKey, api)
            const methodLen = functionLength(method)
            const methodName = functionName(method)
            path.pop()

            if (argsLen >= methodLen) {
                const target = args.slice(methodLen - 1, 1).pop()
                const result = resolve(path.concat(apply(method, args.slice(0, methodLen - 1))), target)
                // console.log(`(apply/method/resolve)`, {
                //     methodName,
                //     method,
                //     methodLen,
                //     argsLen,
                //     path,
                //     args,
                //     target,
                //     result
                // })

                return result
            }

            const result = apply(method, args.slice(0, methodLen))
            const resultLen = functionLength(result)
            if (!result._name) result._name = functionName(method) + resultLen
            const resultName = functionName(result)
            console.log(`(apply/method/create)`, { resultName, method, methodLen, argsLen, path, args, result })

            return create(path.concat(result), handler)
        }

        if (lastArg && !is.func(lastArg)) {
            const target = args.pop()
            //console.warn(`(apply/resolve)`, { pathLen, argsLen, isMethod, lastKey, target, path, args })

            return resolve(path.concat(args), target)
        }

        console.warn(`(apply/create)`, { pathLen, argsLen, isMethod, lastKey, lastArg, path, args })

        return create(path.concat(args), handler)
    }
}

export default create([], handler)

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}
