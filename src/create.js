import is from "./is"
import { toPrimitive, toArray } from "./utils"

const identity = () => `bitbox`
const iterator = keys => Array.prototype[Symbol.iterator].bind(keys)

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}

/**
 * Create box
 * @param  {Function}   box
 * @param  {Array}      [keys=[]]
 * @param  {Boolean}    [isRoot=true]
 * @return {Function}   box
 */

function create(box, keys = [], isRoot = true) {
    const root = [...keys]

    return new Proxy(box, {
        apply(target, context, args) {
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
            if (key === Symbol.iterator) return iterator(keys)
            if (key === Symbol.toPrimitive) return primitive(keys)
            if (key === Symbol.toStringTag) return identity
            if (key === Symbol.for("box/path")) return [...keys]

            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : key

            keys = [...keys, nextKey]

            delete primitive.__key
            delete primitive.__keys

            return isRoot ? create(box, keys) : receiver
        },
        has(box, key) {
            return true
        }
    })
}

export default create
