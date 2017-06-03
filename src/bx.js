import is from "./is"
import curryN from "./curryN"

import { toPrimitive } from "./utils"
import resolve from "./resolve"
import * as api from "./operators"

function proxy(path = [], handler) {
    return new Proxy(function box() {}, {
        apply(target, thisArg, args) {
            if (handler && handler.apply) {
                return handler.apply(path, args, thisArg)
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
                return handler.get(path, nextKey, receiver)
            }

            return proxy(path.concat(nextKey))
        },
        has(target, key, receiver) {
            return path.indexOf(key) > -1
        }
    })
}

const handler = {
    get(path, key) {
        return proxy(path.concat(key), handler)
    },
    apply(path, args) {
        const key = path[path.length - 1]
        if (is.func(api[key])) {
            path.pop()

            const _fn = api[key]
            const _fnLength = _fn.length
            const _fnArgs = args.splice(0, _fnLength - 1)
            const fn = _fn(..._fnArgs)
            const fnLength = fn.length

            console.log(`[apply]`, _fnLength, fnLength, _fnArgs, path, key, args)
            if (!args.length) {
                return proxy(path.concat(fn), handler)
            }
            return fn(resolve(path, ...args))
        }

        if (args.length && !is.func(args[0])) return resolve(path, args[0])
        return proxy(path.concat(args), handler)
    }
}
export default proxy([], handler)

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}
