import is from "../is"
import { toPrimitive } from "../utils"
import pipe from "./pipe"
import resolve from "../resolve"
import curry from "../curry"
import api from "ramda"

export default proxy([])

function apply(path, args) {
    const target = !is.func(args[args.length - 1]) && args.pop()
    const method = Reflect.has(api, path[path.length - 1]) && path.pop()

    if (method) {
        const fn = Reflect.get(api, method)
        args = [fn(...args)]
    }

    const keys = path.concat(args)

    if (target) {
        return resolve(keys, target)
    }

    return proxy(keys)
}

function proxy(path = []) {
    return new Proxy(apply, {
        apply(target, thisArg, args) {
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

            if (target.next) return target.next(path, nextKey, receiver)

            return proxy(path.concat(nextKey))
        },
        has(target, key, receiver) {
            return path.indexOf(key) > -1
        }
    })
}

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}
