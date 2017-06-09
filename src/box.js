import is from "./is"
import curry from "./curry"
import resolve from "./resolve"
import * as api from "./operators"
import { toPrimitive, toJSON } from "./utils"
import { get, has, apply, last, log } from "./operators"
const h = {
    get(path, key, box) {
        if (key === "@@functional/placeholder") {
            console.log(`executingTarget`, key, path)
            return true
        }
        if (key === "@@isHandler") return true
        return create(box, path.concat(key), h)
    }
}
export const __ = create(
    function __(path, ...args) {
        if (args.length === 1 && !is.func(args[0])) return resolve(path, args[0])
        return create(resolve, path.concat(args), h)
    },
    [],
    h
)

let isExecuting
let executingTarget

function create(box, path = [], handler) {
    const proxy = new Proxy(box, {
        apply(target, context, args) {
            isExecuting = true
            executingTarget = target
            const result = Reflect.apply(target, context, [path].concat(args))
            isExecuting = false
            executingTarget = undefined
            return result
        },
        get(target, key, receiver) {
            if (key === "$") return { box, target, path }
            if (key === Symbol.for("box")) return [box, path]
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(path)
            if (key === Symbol.toPrimitive) return primitive(path)
            if (key === "displayName") return toPrimitive(path)
            if (key === "toString") return Reflect.get(target, key)
            if (key === "toJSON" || key === "toJS") return () => toJSON(path)

            if (target && Reflect.has(target, key)) {
                const fn = Reflect.get(target, key)
                if (is.func(fn)) {
                    return create(fn, path.slice(), handler)
                }
            }

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
            if (has(key, api)) return true
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
