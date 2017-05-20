import is from "./is"
import { toPrimitive, toArray } from "./utils"

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

    return new Proxy(box, {
        apply(box, context, args) {
            if (isRoot) keys = [...root]

            return Reflect.apply(box, context, [keys, ...args])
        },
        get(box, key, receiver) {
            if (isRoot) keys = [...root]
            if (key === "$") return { box, keys, root, isRoot }
            if (key === "apply" || key === "call") return Reflect.get(box, key, receiver)
            if (key === "toArray") return () => toArray(keys)
            if (key === "toJS") return () => toArray(keys)
            if (key === "displayName") return toPrimitive(keys)
            if (key === Symbol.isConcatSpreadable) return false
            if (key === Symbol.iterator) return keys => Array.prototype[Symbol.iterator].bind(keys)
            if (key === Symbol.toPrimitive) return primitive(keys)
            if (key === Symbol.toStringTag) return () => `bitbox`
            if (key === Symbol.for("box/path")) return [...keys]

            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : key

            keys = [...keys, nextKey]

            delete primitive.__key
            delete primitive.__keys

            return isRoot ? factory(box, keys, false) : receiver
        },
        has(box, key) {
            return true
        }
    })
}

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}

export default factory
