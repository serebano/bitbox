import resolve from "../resolve"
import R from "ramda"
import get from "./get"
import set from "./set"

function path(keys = [], obj = {}) {
    return new Proxy(keys, {
        get(target, key, receiver) {
            if (key === "$") return keys
            if (key === "get")
                return function get(target) {
                    return resolve(keys, target)
                }
            if (key === "set")
                return function set(value, target) {
                    const key = keys.pop()
                    return set(key, value, resolve(keys, target))
                }
            if (key === "apply")
                return function apply(fn, ...args) {
                    return fn(keys, ...args)
                }
            if (key === Symbol.toPrimitive) return () => keys.join(".")
            //if (Reflect.has(obj, key)) return Reflect.get(obj, key)

            //if (Reflect.has(target, key, receiver)) return Reflect.get(target, key, receiver)

            return path(keys.concat(key))
        }
    })
}

export default path([], R)
