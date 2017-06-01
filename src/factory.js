import is from "./is"
import { toPrimitive, toArray } from "./utils"
import map from "./map"
import curry from "./curry"
import resolve from "./resolve"
import compose from "./compose"
import * as operators from "./operators"

/**
 * bb/factory
 * @param  {Function}   box
 * @param  {Array}      [keys=[]]
 * @param  {Boolean}    [isRoot=true]
 * @return {Function}   box
 */

function factory(box, keys = [], isRoot = true) {
    if (!is.func(box)) throw new Error(`[factory] box must be a function`)

    const root = [...keys]

    const proxy = new Proxy(box, {
        // construct(box, [ctor, ...args]) {
        //     if (isRoot) keys = [...root]
        //
        //     return Reflect.construct(ctor, [proxy, ...args])
        // },
        apply(box, context, args) {
            if (isRoot) keys = [...root]

            return box(keys, args)
        },
        get(box, key, receiver) {
            if (isRoot) keys = [...root]
            if (key === "$") return { box, keys, root, isRoot }
            if (key === "apply" || key === "call" || key === "bind")
                return Reflect.get(box, key, receiver)

            if (key === "map")
                return factory(function $map(keys, fn, functor) {
                    if (arguments.length === 3) return map(fn, resolve(functor, keys))
                    return factory((keys, functor) => map(fn, resolve(functor, keys)), keys)
                }, keys)

            if (key === "toArray") return () => toArray(keys)
            if (key === "toJSON") return () => toArray(keys)
            if (key === "displayName") return toPrimitive(keys)
            if (key === Symbol.isConcatSpreadable) return false
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].bind(keys)
            if (key === Symbol.toPrimitive) return primitive(keys)
            if (key === Symbol.toStringTag) return () => `bitbox`
            if (key === Symbol.for("box/path")) return [...keys]
            // if (Reflect.has(box, key, receiver)) {
            //     const value = Reflect.get(box, key, receiver)
            //     if (is.func(value)) {
            //         return (...args) => value.apply(value, [receiver, ...args])
            //     }
            //     return value
            // }

            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : is.numeric(key) ? parseInt(key) : key

            keys = [...keys, nextKey]

            delete primitive.__key
            delete primitive.__keys

            return isRoot ? factory(box, keys, true) : receiver
        },
        set(box, key, value) {
            if (Reflect.has(box, "set")) return Reflect.get(box, "set")(box, key, value)
            return Reflect.set(box, key, value)
        },
        has(box, key) {
            return true
        }
    })

    return proxy
}

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}

export default factory
